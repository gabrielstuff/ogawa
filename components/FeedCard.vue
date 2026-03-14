<script setup lang="ts">
import type { Feed } from '~/types'

interface Props {
  feed: Feed
}

defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
}>()
</script>

<template>
  <div class="bracket p-4">
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-ink-0 truncate">
          {{ feed.title }}
        </h3>
        <p class="text-sm font-mono text-ink-3/60 truncate">
          {{ feed.url }}
        </p>
        <div class="flex gap-4 mt-2 text-xs font-mono text-ink-3/40">
          <span>{{ feed.items?.length || 0 }} items</span>
          <span>{{ feed.lastUpdated ? new Date(feed.lastUpdated).toLocaleDateString() : 'never' }}</span>
        </div>
      </div>
      <div class="flex gap-2 ml-4">
        <UButton
          variant="ghost"
          color="error"
          icon="i-heroicons-trash"
          @click="emit('delete', feed.id)"
        />
      </div>
    </div>
    <span class="bl" /><span class="br2" />
  </div>
</template>
