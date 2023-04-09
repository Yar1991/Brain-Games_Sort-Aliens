<script setup lang="ts">

import AccentButton from "@/components/AccentButton.vue"
import { useGameStore } from "@/stores/game-store"

const gameStore = useGameStore();

function goHome() {
  gameStore.currentMode = "start";
  gameStore.points = 0;
  gameStore.timeCount = 59;
}

function startOver() {
  gameStore.currentMode = 'training-play';
  gameStore.points = 0;
  gameStore.timeCount = 59;
}

</script>


<template>
  <div class="training-end-modal">
    <div>
      <AccentButton bg="#54A124" @click="goHome">
        Home
      </AccentButton>
      <AccentButton bg="#A1243B" @click="startOver">
        Again
      </AccentButton>
    </div>
  </div>
</template>


<style scoped lang="scss">
.training-end-modal {
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 10%, 0.7);

  div {
    display: flex;
    align-items: center;
    width: 50%;
    padding: 1.5rem;
    background-color: var(--main-dark);
    border-radius: var(--bg-radius);
    color: #fff;
    gap: 2rem;
  }
}
</style>