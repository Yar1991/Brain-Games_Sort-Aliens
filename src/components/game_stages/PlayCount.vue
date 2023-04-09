<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useGameStore } from "@/stores/game-store"

const gameStore = useGameStore();
const count = ref<number>(3);
const interval = ref<number | undefined>(undefined);

onMounted(() => {
  interval.value = setInterval(() => {
    if (count.value - 1 > 0) {
      count.value--;
    } else {
      gameStore.currentMode = "play";
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value);
})

</script>


<template>
  <div class="count-layer">
    <div>
      <Transition name="count">
        <h3 :key="count">{{ count }}</h3>
      </Transition>
    </div>
  </div>
</template>


<style scoped lang="scss">
.count-layer {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  background-color: #0F0F11;
  border-radius: var(--bg-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;

  div {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    background-color: #F8F7F7;
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      font-size: 2.6rem;
      font-weight: 600;
      color: #0F0F11;
    }

    .count-move-active,
    .count-enter-active,
    .count-leave-active {
      transition: all 0.5s ease;
    }

    .count-leave-from,
    .count-enter-to {
      translate: 0% 0%;
    }

    .count-leave-to {
      translate: 0% 150%;
    }

    .count-enter-from {
      translate: 0 -150%;
    }

    .count-leave-active {
      position: absolute;
    }
  }
}
</style>