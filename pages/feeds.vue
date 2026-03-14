<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('feeds.title')} - Ogawa`),
})

const { feeds, addFeed, deleteFeed } = useFeeds()

const showAddModal = ref(false)
const newFeedUrl = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleAddFeed() {
  if (!newFeedUrl.value) return

  isLoading.value = true
  error.value = ''

  try {
    await addFeed(newFeedUrl.value)
    showAddModal.value = false
    newFeedUrl.value = ''
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || t('feeds.addFailed')
  }
  finally {
    isLoading.value = false
  }
}

async function handleDeleteFeed(id: number) {
  try {
    await deleteFeed(id)
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || t('feeds.deleteFailed')
  }
}
</script>

<template>
  <div class="p-4">
    <div class="mb-6 bracket-lg px-4 py-3">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-ink-0">
          {{ t('feeds.title') }}
        </h1>
        <UButtonBracket
          variant="bracket"
          icon="i-heroicons-plus"
          @click="showAddModal = true"
        >
          {{ t('feeds.addFeed') }}
        </UButtonBracket>
      </div>
      <p class="header-meta">
        RSS feed management for automated torrent downloads
      </p>
      <span class="bl" /><span class="br2" />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="solid"
      class="mb-4 font-mono"
    >
      {{ error }}
    </UAlert>

    <EmptyState
      v-if="!feeds || feeds.length === 0"
      :title="t('feeds.noFeeds')"
      subtitle="Add RSS feeds to automatically download torrents"
      :icon="t('feeds.noFeeds') ? '' : 'i-heroicons-rss'"
    >
      <UButtonBracket
        variant="bracket"
        @click="showAddModal = true"
      >
        {{ t('feeds.addFirstFeed') }}
      </UButtonBracket>
    </EmptyState>

    <FeedList
      v-else
      :feeds="feeds"
      @delete="handleDeleteFeed"
    />

    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold text-ink-0">
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
            <span class="bl" /><span class="br2" />
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
            <UButtonBracket
              variant="bracket"
              :loading="isLoading"
              :disabled="!newFeedUrl"
              @click="handleAddFeed"
            >
              {{ t('feeds.addFeed') }}
            </UButtonBracket>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
