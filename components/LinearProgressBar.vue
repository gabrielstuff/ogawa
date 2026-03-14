<script setup lang="ts">
interface Props {
  progress: number
  state?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

const stateColor = computed(() => {
  switch (props.state) {
    case 'downloading': return 'bg-accent-t'
    case 'seeding': return 'bg-accent'
    case 'paused': return 'bg-flicker'
    case 'error': return 'bg-red-500'
    default: return 'bg-scan'
  }
})
</script>

<template>
  <div
    :class="[sizeClasses[size], 'bg-scan/30 overflow-hidden']"
  >
    <div
      class="h-full transition-all"
      :class="stateColor"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>
