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
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}

const strokeWidth = {
  sm: 2,
  md: 3,
  lg: 4,
}

const textColor = computed(() => {
  switch (props.state) {
    case 'downloading': return 'text-accent'
    case 'seeding': return 'text-ink-0'
    case 'paused': return 'text-flicker'
    case 'error': return 'text-red-400'
    default: return 'text-ink-3'
  }
})
</script>

<template>
  <div
    :class="sizeClasses[size]"
    class="relative"
  >
    <svg
      class="w-full h-full -rotate-90"
      viewBox="0 0 36 36"
    >
      <path
        class="text-scan/30"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth[size]"
      />
      <path
        :class="textColor"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth[size]"
        :stroke-dasharray="`${progress}, 100`"
      />
    </svg>
    <span
      :class="[textColor, 'absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium']"
    >
      {{ progress }}%
    </span>
  </div>
</template>
