<script setup lang="ts">
import type { Feed } from '~/types'

interface Props {
  feeds: Feed[]
}

defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
}>()
</script>

<template>
  <div class="space-y-3">
    <FeedCard
      v-for="feed in feeds"
      :key="feed.id"
      :feed="feed"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
