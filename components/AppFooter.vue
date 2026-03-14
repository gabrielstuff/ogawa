<script setup lang="ts">
defineProps<{
  offsetLeft?: number
}>()
</script>

<template>
  <footer
    class="fixed bottom-0 right-0 z-40"
    :style="{ left: `${offsetLeft ?? 0}px` }"
  >
    <StatusBar />
  </footer>
</template>
