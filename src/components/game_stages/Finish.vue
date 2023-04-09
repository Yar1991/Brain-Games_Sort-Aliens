<script setup lang="ts">
import AccentButton from '@/components/AccentButton.vue';
import { useGameStore } from "@/stores/game-store"

const gameStore = useGameStore();

function goHome() {
  gameStore.currentMode = "start";
  gameStore.difficultyLevel = "";
  gameStore.timeCount = 59;
  gameStore.points = 0;
}

function startOver() {
  gameStore.currentMode = 'level';
  gameStore.difficultyLevel = "";
  gameStore.timeCount = 59;
  gameStore.points = 0;
}
</script>


<template>
  <div class="result-box">
    <h3>Results</h3>
    <div class="result-info">
      <h4>level: <span>{{ gameStore.difficultyLevel }}</span></h4>
      <h4>points: <span>{{ gameStore.points }}</span></h4>
    </div>
    <div class="result-btns">
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
.result-box {
  position: absolute;
  inset: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  gap: 3.5rem;

  h3 {
    font-size: 2.2rem;
    font-weight: 500;
  }

  .result-info {
    width: 45%;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    background-color: #F8F7F7;
    border-radius: var(--bg-radius);
    color: var(--main-dark);
    font-size: 1.1rem;

    h4 {
      font-weight: 400;

      span {
        font-weight: 600;
      }
    }
  }

  .result-btns {
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
}
</style>