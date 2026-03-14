<script setup lang="ts">
const props = defineProps<{
  variant?: 'solid' | 'outline' | 'ghost' | 'bracket'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'neutral'
  loading?: boolean
  disabled?: boolean
  icon?: string
  to?: string
}>()

const variant = computed(() => props.variant === 'bracket' ? 'ghost' : props.variant)
</script>

<template>
  <UButton
    :variant="variant"
    :size="size"
    :color="color"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :to="to"
    :class="[variant === 'ghost' && props.variant === 'bracket' ? 'btn-bracket' : '']"
  >
    <span v-if="props.variant === 'bracket'" class="bl"></span>
    <slot />
    <span v-if="props.variant === 'bracket'" class="br2"></span>
  </UButton>
</template>
