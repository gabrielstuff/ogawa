<script setup lang="ts">
interface Props {
  state?: string
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
})

const { t } = useI18n()

const badgeClasses = computed(() => {
  const base = 'font-mono font-medium'
  const size = props.size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'

  const colors: Record<string, string> = {
    downloading: 'bg-accent-t/20 text-accent',
    seeding: 'bg-accent/20 text-ink-0',
    paused: 'bg-flicker/20 text-flicker',
    error: 'bg-red-500/20 text-red-400',
    stopped: 'bg-line/30 text-ink-3/50',
  }

  return `${base} ${size} ${colors[props.state || 'stopped']}`
})
</script>

<template>
  <span :class="badgeClasses">
    {{ t(`status.${state || 'stopped'}`) }}
  </span>
</template>
