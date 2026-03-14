<script setup lang="ts">
import type { Feed } from '~/types'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('feeds.title')} - Ogawa`),
})

const { data: feeds, refresh } = await useFetch<Feed[]>('/api/feeds')

const showAddModal = ref(false)
const newFeedUrl = ref('')
const isLoading = ref(false)
const error = ref('')

async function addFeed() {
  if (!newFeedUrl.value) return

  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/feeds', {
      method: 'POST',
      body: { url: newFeedUrl.value },
    })

    showAddModal.value = false
    newFeedUrl.value = ''
    refresh()
  }
  catch (e: any) {
    error.value = e.message || t('feeds.addFailed')
  }
  finally {
    isLoading.value = false
  }
}

async function deleteFeed(id: number) {
  try {
    await $fetch(`/api/feeds/${id}`, {
      method: 'DELETE',
    })
    refresh()
  }
  catch (e: any) {
    error.value = e.message || t('feeds.deleteFailed')
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">
        {{ t('feeds.title') }}
      </h1>
      <UButton
        icon="i-heroicons-plus"
        @click="showAddModal = true"
      >
        {{ t('feeds.addFeed') }}
      </UButton>
    </div>

    <!-- Error -->
    <UAlert
      v-if="error"
      color="error"
      variant="solid"
      class="mb-4"
    >
      {{ error }}
    </UAlert>

    <!-- Empty State -->
    <div
      v-if="!feeds || feeds.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-heroicons-rss"
        class="w-16 h-16 mx-auto text-gray-600 mb-4"
      />
      <p class="text-gray-400 mb-4">
        {{ t('feeds.noFeeds') }}
      </p>
      <UButton @click="showAddModal = true">
        {{ t('feeds.addFirstFeed') }}
      </UButton>
    </div>

    <!-- Feed List -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="feed in feeds"
        :key="feed.id"
        class="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
      >
        <div class="flex-1 min-w-0">
          <h3 class="font-medium truncate">
            {{ feed.title }}
          </h3>
          <p class="text-sm text-gray-400 truncate">
            {{ feed.url }}
          </p>
          <div class="flex gap-2 mt-2 text-xs text-gray-500">
            <span>{{ t('feeds.items', { count: feed.items?.length || 0 }) }}</span>
            <span>{{ t('feeds.lastUpdated', { date: feed.lastUpdated ? new Date(feed.lastUpdated).toLocaleDateString() : t('feeds.never') }) }}</span>
          </div>
        </div>
        <div class="flex gap-2 ml-4">
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="deleteFeed(feed.id)"
          />
        </div>
      </div>
    </div>

    <!-- Add Feed Modal -->
    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ t('feeds.addRssFeed') }}
          </h2>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="newFeedUrl"
            :placeholder="t('feeds.feedUrlPlaceholder')"
            size="lg"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              @click="showAddModal = false"
            >
              {{ t('feeds.cancel') }}
            </UButton>
            <UButton
              :loading="isLoading"
              :disabled="!newFeedUrl"
              @click="addFeed"
            >
              {{ t('feeds.addFeed') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
