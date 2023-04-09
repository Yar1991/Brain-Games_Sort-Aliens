import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGameStore = defineStore("game-store", () => {
  const currentMode = ref<string>("start");
  const difficultyLevel = ref<string>("");
  const points = ref<number>(0);
  const timeCount = ref<number>(59);
  return { currentMode, difficultyLevel, points, timeCount };
});
