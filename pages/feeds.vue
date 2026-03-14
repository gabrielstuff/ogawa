<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const toast = useToast()

useHead({
  title: computed(() => `${t('feeds.title')} - Ogawa`),
})

const { feeds, addFeed, deleteFeed } = useFeeds()

const showAddModal = ref(false)
const newFeedUrl = ref('')
const isLoading = ref(false)

async function handleAddFeed() {
  if (!newFeedUrl.value) return

  isLoading.value = true

  try {
    await addFeed(newFeedUrl.value)
    showAddModal.value = false
    newFeedUrl.value = ''
    toast.add({ title: t('feeds.addSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('feeds.addFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isLoading.value = false
  }
}

async function handleDeleteFeed(id: number) {
  try {
    await deleteFeed(id)
    toast.add({ title: t('feeds.deleteSuccess'), color: 'neutral', icon: 'i-heroicons-trash' })
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('feeds.deleteFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
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
          v-if="!showAddModal"
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

    <Transition name="slide-down">
      <div
        v-if="showAddModal"
        class="mb-6 bracket-lg px-4 py-3"
      >
        <p class="text-xs font-mono text-ink-3/50 uppercase tracking-widest mb-3">
          {{ t('feeds.addRssFeed') }}
        </p>
        <div class="flex gap-2 items-center">
          <div class="input-bracket flex-1">
            <UInput
              v-model="newFeedUrl"
              :placeholder="t('feeds.feedUrlPlaceholder')"
              size="lg"
              class="w-full"
              autofocus
              @keydown.enter="handleAddFeed"
              @keydown.escape="showAddModal = false"
            />
            <span class="bl" /><span class="br2" />
          </div>
          <UButton
            variant="ghost"
            class="btn-ghost shrink-0"
            @click="showAddModal = false"
          >
            {{ t('feeds.cancel') }}
          </UButton>
          <UButtonBracket
            variant="bracket"
            :loading="isLoading"
            :disabled="!newFeedUrl"
            class="shrink-0"
            @click="handleAddFeed"
          >
            {{ t('feeds.addFeed') }}
          </UButtonBracket>
        </div>
        <span class="bl" /><span class="br2" />
      </div>
    </Transition>

    <EmptyState
      v-if="!feeds || feeds.length === 0"
      :title="t('feeds.noFeeds')"
      subtitle="Add RSS feeds to automatically download torrents"
      icon="i-heroicons-rss"
    >
      <UButtonBracket
        v-if="!showAddModal"
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
  </div>
</template>
