<script setup lang="ts">
defineProps<{
  position?: 'top' | 'bottom'
}>()

const appName = 'Ogawa'
const appVersion = '1.0.0'
</script>

<template>
  <div
    class="status-strip w-full"
    :class="position === 'top' ? '!border-t-0 border-b border-b-line' : ''"
  >
    <div class="flex items-center gap-2">
      <span class="status-dot" />
      <span>daemon: connected</span>
    </div>
    <span>feeds: 0</span>
    <span>watch: off</span>
    <span>disk: -- GB free</span>
    <span class="ml-auto">{{ appName }} v{{ appVersion }}</span>
  </div>
</template>
