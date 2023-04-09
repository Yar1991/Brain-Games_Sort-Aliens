<script setup lang="ts">

defineProps<{ bg: string }>()
</script>

<template>
  <button type="button" class="accent-btn">
    <slot></slot>
  </button>
</template>


<style scoped lang="scss">
.accent-btn {
  width: clamp(8rem, 8rem, 9rem);
  height: 3.1rem;
  border-radius: var(--bg-radius);
  border: none;
  color: #fff;
  background-color: v-bind(bg);
  box-shadow: 0 4px 5px hsla(0, 0%, 0%, 0.4), 0 0 4px hsla(0, 0%, 0%, 0.7);
  cursor: pointer;
  transition: box-shadow 0.1s ease, translate 0.1s ease, filter 0.2s ease;

  &:hover {
    filter: brightness(115%);
  }

  &:active {
    box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.4);
    translate: 0 0.2rem;
  }
}
</style>