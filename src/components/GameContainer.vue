<script setup lang="ts">
import Start from "@/components/game_stages/Start.vue"
import Level from "@/components/game_stages/Level.vue"
import { useGameStore } from "@/stores/game-store"
import PlayCount from "@/components/game_stages/PlayCount.vue"
import Play from "@/components/game/Game.vue"
import Finish from "@/components/game_stages/Finish.vue"

const gameStore = useGameStore();
</script>

<template>
  <div class="game-container">
    <Transition name="mode" mode="out-in">
      <Start v-if="gameStore.currentMode === 'start'" />
      <Level v-else-if="gameStore.currentMode === 'level'" />
      <PlayCount v-else-if="gameStore.currentMode === 'play-count'" />
      <Play v-else-if="['play', 'training-start', 'training-play', 'training-end'].includes(gameStore.currentMode)" />
      <Finish v-else-if="gameStore.currentMode === 'finish'" />
    </Transition>
  </div>
</template>


<style scoped lang="scss">
.game-container {
  position: relative;
  width: min(47rem, 100%);
  height: min(37rem, 80%);
  background-color: var(--main-dark);
  border-radius: var(--bg-radius);
  box-shadow: 0 5px 10px hsla(0, 0%, 0%, 0.3), 0 0 10px hsla(0, 0%, 0%, 0.4);
  overflow: hidden;
  z-index: 2;
  animation: anim-container 1s ease-out both;
  transform-origin: center;

  @keyframes anim-container {
    from {
      opacity: 0;
    }
  }

  .mode-enter-active {
    transition: all 0.8s ease-out;
  }

  .mode-leave-active {
    transition: all 0.6s ease-in;
  }

  .mode-enter-from,
  .mode-leave-to {
    opacity: 0;
  }

  .mode-enter-to,
  .mode-leave-from {
    opacity: 1;
  }
}
</style>