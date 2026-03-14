<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
}

defineProps<Props>()

const _emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state bracket-lg">
    <UIcon
      v-if="icon"
      :name="icon"
      class="w-16 h-16 mx-auto text-ink-3/30 mb-4"
    />
    <div class="empty-state-title">
      {{ title }}
    </div>
    <div
      v-if="subtitle"
      class="empty-state-sub"
    >
      {{ subtitle }}
    </div>
    <slot />
    <span class="bl" /><span class="br2" />
  </div>
</template>
