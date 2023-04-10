<script setup lang="ts">

import { ref, onMounted, watch, onUnmounted } from "vue"
import P from "phaser";
import { useGameStore } from "@/stores/game-store"
import InfoBar from "@/components/game/InfoBar.vue"
import TrainingStartModal from "@/components/game/TrainingStartModal.vue"
import TrainingEndModal from "@/components/game/TrainingEndModal.vue"


const gameStore = useGameStore();

const gameRef = ref<P.Game>(); // game instance ref
const gameScene = ref<P.Scene>(); // current game scene
const gameContainer = ref<HTMLElement>(); // container where the canvas is rendered

const aliens = ref<P.Physics.Arcade.Group>();
const aliensColors = ref<string[]>(["green-alien", "yellow-alien", "red-alien"]);
const planets = ref<P.Physics.Arcade.StaticGroup>();
const backgrounds = ref<P.GameObjects.TileSprite[]>();

const debounceTimer = ref<number | null>(); // timeout for debouncing when key is pressed

function preloadGame(this: P.Scene) {
  this.load.image("green-alien", "/game-assets/alien-green.svg")
  this.load.image("yellow-alien", "/game-assets/alien-yellow.svg")
  this.load.image("red-alien", "/game-assets/alien-red.svg")
  this.load.image("green-planet", "/game-assets/planet_green.png")
  this.load.image("yellow-planet", "/game-assets/planet_yellow.png")
  this.load.image("red-planet", "/game-assets/planet_red.png")
  this.load.image("bg-dust", "/game-assets/bg-dust.png")
  this.load.image("bg-stars", "/game-assets/bg-stars.png")
  this.load.image("mistake", "/game-assets/mistake.png")
}

function createGame(this: P.Scene) {

  gameScene.value = this;

  gameStore.currentMode === "training-start" && this.scene.pause();

  // adding backgrounds:
  backgrounds.value = [this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "bg-stars").setOrigin(0).setScrollFactor(0), this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "bg-dust").setScale(1.2).setOrigin(0).setScrollFactor(0)]

  // planets:
  planets.value = this.physics.add.staticGroup();
  const greenPlanet: Phaser.Physics.Arcade.Sprite = planets.value.create(90, this.scale.height + 10, "green-planet")
  const yellowPlanet: Phaser.Physics.Arcade.Sprite = planets.value.create(this.scale.width - 90, this.scale.height + 10, "yellow-planet")
  if (gameStore.difficultyLevel === "hard" || gameStore.currentMode.includes("training")) {
    const redPlanet: Phaser.Physics.Arcade.Sprite = planets.value.create(this.scale.width / 2, this.scale.height + 40, "red-planet")
    redPlanet.setScale(0.50).setScrollFactor(0)
    redPlanet.body.updateFromGameObject()
  }
  yellowPlanet.setScale(0.50).setScrollFactor(0)
  yellowPlanet.body.updateFromGameObject()
  greenPlanet.setScale(0.50).setScrollFactor(0)
  greenPlanet.body.updateFromGameObject()

  // aliens:
  aliens.value = this.physics.add.group();
  for (let i = 3; i >= 0; --i) {
    let randomIndex: number;
    let alien: P.Physics.Arcade.Sprite;
    if (gameStore.difficultyLevel === "hard" || gameStore.currentMode.includes("training")) {
      randomIndex = Math.floor(Math.random() * aliensColors.value.length);
      alien = aliens.value?.create(this.scale.width / 2, 100 * i - 20, aliensColors.value[randomIndex])
    } else {
      randomIndex = Math.floor(Math.random() * 2);
      alien = aliens.value?.create(this.scale.width / 2, 100 * i - 20, ["green-alien", "yellow-alien"][randomIndex])
    }
    alien.setScale(0.8).setScrollFactor(0).setActive(true);
  }
  this.physics.add.collider(aliens.value, planets.value, handleCollision);

  document.addEventListener("keydown", moveAliens)
}

function moveAliens(e: KeyboardEvent) {
  // moving aliens on the "keydown" event:
  const keyVal = e.key;
  if ((["ArrowDown", "s"].includes(keyVal) && gameStore.difficultyLevel === "normal") || ["training-end", "finish"].includes(gameStore.currentMode)) {
    return;
  }
  if (["ArrowLeft", "a"].includes(keyVal)) {
    clearTimeout(debounceTimer.value as number);
    debounceTimer.value = setTimeout(() => {
      const targetAlien = aliens.value?.getFirst(true) as P.Physics.Arcade.Sprite;
      gameScene.value!.events.on("update", () => {
        targetAlien.y += 14;
        targetAlien.x -= 18;
      })
      updateAliens();
    }, 200)
  } else if (["ArrowRight", "d"].includes(keyVal)) {
    clearTimeout(debounceTimer.value as number);
    debounceTimer.value = setTimeout(() => {
      const targetAlien = aliens.value?.getFirst(true) as P.Physics.Arcade.Sprite;
      gameScene.value!.events.on("update", () => {
        targetAlien.y += 14;
        targetAlien.x += 18;
      })
      updateAliens();
    }, 200)
  } else if (["ArrowDown", "s"].includes(keyVal) && (gameStore.difficultyLevel === "hard" || gameStore.currentMode === "training-play")) {
    clearTimeout(debounceTimer.value as number);
    debounceTimer.value = setTimeout(() => {
      const targetAlien = aliens.value?.getFirst(true) as P.Physics.Arcade.Sprite;
      gameScene.value!.events.on("update", () => {
        targetAlien.y += 14;
      })
      updateAliens();
    }, 200)
  } else {
    return;
  }
}


function updateGame(this: P.Scene) {
  // moving the backgrounds and camera:
  this.cameras.main.scrollY += 0.5
  backgrounds.value![0].setTilePosition(this.cameras.main.scrollX, this.cameras.main.scrollY * 0.8)
  backgrounds.value![1].setTilePosition(this.cameras.main.scrollX, this.cameras.main.scrollY * 0.3)
}


function handleCollision(obj1: P.GameObjects.GameObject, obj2: P.GameObjects.GameObject) {
  // handles collisions between aliens and planets:
  const alien = obj1 as P.Physics.Arcade.Sprite;
  const planet = obj2 as P.Physics.Arcade.Sprite;

  let mistakeTimeout: number | null = null;
  if (alien.texture.key.split("-")[0] === planet.texture.key.split("-")[0]) {
    aliens.value?.remove(alien, true, true);
    gameStore.points += 50;
  }
  else {
    const showMistake = gameScene.value?.add.image(planet.x, gameScene.value.scale.height - 50, "mistake");
    aliens.value?.remove(alien, true, true);
    showMistake?.setScale(0.4).setScrollFactor(0).setTint(0xc10808);
    setTimeout(() => {
      showMistake?.destroy();
    }, 200)
  }


  if (mistakeTimeout) {
    return () => clearTimeout(mistakeTimeout as number);
  }
}

function updateAliens() {
  // adds a new alien after a collision:
  const scene = gameScene.value!;
  let randomIndex: number;
  let alien: P.Physics.Arcade.Sprite;
  if (gameStore.difficultyLevel === "hard" || gameStore.currentMode.includes("training")) {
    randomIndex = Math.floor(Math.random() * aliensColors.value.length);
    alien = aliens.value?.create(scene.scale.width / 2, -120, aliensColors.value[randomIndex]);
  } else {
    randomIndex = Math.floor(Math.random() * 2);
    alien = aliens.value?.create(scene.scale.width / 2, -120, ["green-alien", "yellow-alien"][randomIndex]);
  }


  alien.setScale(0.8).setScrollFactor(0).setActive(true);
  aliens.value?.getChildren().forEach((alien, index) => {
    const targetAlien = alien as P.Physics.Arcade.Sprite;
    if (index !== 0) {
      scene.tweens.add({
        targets: alien,
        y: targetAlien.y + 100,
        duration: 250,
        ease: "Circular.Out",
      })
    }
  })


}

const watcher = watch(() => gameStore.currentMode, () => {
  // pauses the game when a modal appears before training:
  if (gameStore.currentMode === "training-play") {
    gameScene.value?.scene.resume();
  }
})

onMounted(() => {

  // game config:
  const gameConfig: P.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: "100%",
    height: "100%",
    parent: gameContainer.value,
    antialias: true,
    physics: {
      default: "arcade",
    },
    scene: {
      preload: preloadGame,
      create: createGame,
      update: updateGame
    }
  }

  gameRef.value = new P.Game(gameConfig);
})

onUnmounted(() => {
  // removes the watchers:
  watcher();
  document.removeEventListener("keydown", moveAliens);
})

</script>


<template>
  <div class="game-box" ref="gameContainer">
    <InfoBar />
    <div class="arrows" v-if="gameStore.currentMode.includes('training')">
      <svg viewBox="0 0 288 133" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_505_280)">
          <g clip-path="url(#clip0_505_280)">
            <g filter="url(#filter1_d_505_280)">
              <path d="M259 40L229.833 10V26.6334L184 26.6667V53.3334H229.833V70L259 40Z" fill="#EFF0F1" />
            </g>
          </g>
          <g clip-path="url(#clip1_505_280)">
            <g filter="url(#filter2_d_505_280)">
              <path d="M144 125L174 95.8333L157.367 95.8333L157.333 50L130.667 50L130.667 95.8333L114 95.8333L144 125Z"
                fill="#EFF0F1" />
            </g>
          </g>
          <g clip-path="url(#clip2_505_280)">
            <g filter="url(#filter3_d_505_280)">
              <path d="M29 40L58.1667 70L58.1667 53.3667L104 53.3333L104 26.6667L58.1667 26.6667L58.1667 10L29 40Z"
                fill="#EFF0F1" />
            </g>
          </g>
        </g>
        <defs>
          <filter id="filter0_d_505_280" x="0" y="0" width="288" height="133" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_505_280" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_505_280" result="shape" />
          </filter>
          <filter id="filter1_d_505_280" x="174" y="3.05176e-05" width="95" height="80" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_505_280" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_505_280" result="shape" />
          </filter>
          <filter id="filter2_d_505_280" x="104" y="40" width="80" height="95" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_505_280" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_505_280" result="shape" />
          </filter>
          <filter id="filter3_d_505_280" x="19" y="3.8147e-06" width="95" height="80" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_505_280" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_505_280" result="shape" />
          </filter>
          <clipPath id="clip0_505_280">
            <rect width="100" height="80" fill="white" transform="translate(184 0.000335693)" />
          </clipPath>
          <clipPath id="clip1_505_280">
            <rect width="100" height="80" fill="white" transform="translate(184 25.0004) rotate(90)" />
          </clipPath>
          <clipPath id="clip2_505_280">
            <rect width="100" height="80" fill="white" transform="translate(104 80) rotate(-180)" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <Transition name="modal" mode="out-in">
      <TrainingStartModal v-if="gameStore.currentMode === 'training-start'" />
      <TrainingEndModal v-else-if="gameStore.currentMode === 'training-end'" />
    </Transition>
  </div>
</template>


<style scoped lang="scss">
.game-box {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  background-color: #0F0F11;
  border-radius: var(--bg-radius);
  overflow: hidden;

  .arrows {
    position: absolute;
    top: 60%;
    left: 50%;
    translate: -50% 0;
    margin: auto;
    width: 40%;
  }

  .modal-enter-active {
    transition: all 0.7s ease-out;
  }

  .modal-leave-active {
    transition: all 0.5s ease-in;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-to,
  .modal-leave-from {
    opacity: 1;
  }
}
</style>