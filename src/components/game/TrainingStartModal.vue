<script setup lang="ts">

import AccentButton from "@/components/AccentButton.vue"
import { useGameStore } from "@/stores/game-store"

const gameStore = useGameStore();

</script>


<template>
  <div class="training-start-modal">
    <div>
      <p>Use arrow keys to move aliens to the color-matching planets</p>
      <AccentButton bg="#54A124" @click="gameStore.currentMode = 'training-play'">
        OK
      </AccentButton>
    </div>
  </div>
</template>


<style scoped lang="scss">
.training-start-modal {
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
    flex-direction: column;
    align-items: center;
    width: 50%;
    padding: 1.5rem;
    background-color: var(--main-dark);
    border-radius: var(--bg-radius);
    color: #fff;
    gap: 2rem;

    p {
      font-size: 1.1rem;
      text-align: center;
    }
  }
}
</style>