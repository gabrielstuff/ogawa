<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

defineProps<Props>()
</script>

<template>
  <div class="bracket p-4">
    <div class="flex items-center gap-2 mb-4">
      <UIcon
        :name="icon"
        class="w-5 h-5 text-accent"
      />
      <h2 class="text-lg font-bold text-ink-0">
        {{ title }}
      </h2>
    </div>

    <slot />

    <span class="bl" /><span class="br2" />
  </div>
</template>
