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
    <!-- Header -->
    <div class="mb-6 bracket-lg px-4 py-3">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-phosphor">
          {{ t('feeds.title') }}
        </h1>
        <UButton
          class="btn-bracket"
          icon="i-heroicons-plus"
          @click="showAddModal = true"
        >
          {{ t('feeds.addFeed') }}
          <span class="bl"></span><span class="br2"></span>
        </UButton>
      </div>
      <p class="header-meta">
        RSS feed management for automated torrent downloads
      </p>
      <span class="bl"></span><span class="br2"></span>
    </div>

    <!-- Error -->
    <UAlert
      v-if="error"
      color="error"
      variant="solid"
      class="mb-4 font-mono"
    >
      {{ error }}
    </UAlert>

    <!-- Empty State -->
    <div
      v-if="!feeds || feeds.length === 0"
      class="empty-state bracket-lg"
    >
      <UIcon
        name="i-heroicons-rss"
        class="w-16 h-16 mx-auto text-ghost/30 mb-4"
      />
      <div class="empty-state-title">
        {{ t('feeds.noFeeds') }}
      </div>
      <div class="empty-state-sub">
        Add RSS feeds to automatically download torrents
      </div>
      <UButton
        class="btn-bracket"
        @click="showAddModal = true"
      >
        {{ t('feeds.addFirstFeed') }}
        <span class="bl"></span><span class="br2"></span>
      </UButton>
      <span class="bl"></span><span class="br2"></span>
    </div>

    <!-- Feed List -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="feed in feeds"
        :key="feed.id"
        class="bracket p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-phosphor truncate">
              {{ feed.title }}
            </h3>
            <p class="text-sm font-mono text-ghost/60 truncate">
              {{ feed.url }}
            </p>
            <div class="flex gap-4 mt-2 text-xs font-mono text-ghost/40">
              <span>{{ feed.items?.length || 0 }} items</span>
              <span>{{ feed.lastUpdated ? new Date(feed.lastUpdated).toLocaleDateString() : 'never' }}</span>
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
        <span class="bl"></span><span class="br2"></span>
      </div>
    </div>

    <!-- Add Feed Modal -->
    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold text-phosphor">
            {{ t('feeds.addRssFeed') }}
          </h2>
        </template>

        <div class="space-y-4">
          <div class="input-bracket">
            <UInput
              v-model="newFeedUrl"
              :placeholder="t('feeds.feedUrlPlaceholder')"
              size="lg"
              class="w-full"
            />
            <span class="bl"></span><span class="br2"></span>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              class="btn-ghost"
              @click="showAddModal = false"
            >
              {{ t('feeds.cancel') }}
            </UButton>
            <UButton
              class="btn-bracket"
              :loading="isLoading"
              :disabled="!newFeedUrl"
              @click="addFeed"
            >
              {{ t('feeds.addFeed') }}
              <span class="bl"></span><span class="br2"></span>
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
