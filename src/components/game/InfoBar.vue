<script setup lang="ts">

import { useGameStore } from "@/stores/game-store"
import { ref, onMounted, onUnmounted } from "vue"

const gameStore = useGameStore();

const timeInterval = ref<number | undefined>(undefined);

onMounted(() => {
  timeInterval.value = setInterval(() => {
    if (gameStore.timeCount === 0) {
      gameStore.currentMode = gameStore.currentMode === "play" ? "finish" : "training-end";
      return;
    } else if (gameStore.currentMode === "training-start") {
      return;
    } else {
      gameStore.timeCount--;
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval.value);
})

</script>


<template>
  <div class="bar-box">
    <h4>{{ `00:${gameStore.timeCount < 10 ? "0" + gameStore.timeCount : gameStore.timeCount}` }}</h4>
        <h4>{{ gameStore.difficultyLevel }}</h4>
        <h4>{{ gameStore.points }}</h4>
  </div>
</template>


<style scoped lang="scss">
.bar-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  background-color: hsl(245, 12%, 35%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 1rem;
  color: #fff;

  h4 {
    flex: 1;
    text-align: center;

    &:nth-of-type(2) {
      flex: 7;
    }
  }
}
</style>