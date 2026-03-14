<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const addTorrentModal = useAddTorrentModal()

useHead({
  title: computed(() => `${t('nav.torrents')} - Ogawa`),
})

const { pending, refresh, searchQuery, statusFilter, filteredTorrents, count } = useTorrents()
const { start: _start, stop: _stop, remove: _remove } = useTorrentActions(refresh)

const showAddModal = ref(addTorrentModal.value.show)
const activeTab = ref(addTorrentModal.value.tab)

const statusOptions = computed(() => [
  { value: 'all', label: t('status.all') },
  { value: 'downloading', label: t('status.downloading') },
  { value: 'seeding', label: t('status.seeding') },
  { value: 'paused', label: t('status.paused') },
  { value: 'stopped', label: t('status.stopped') },
  { value: 'error', label: t('status.error') },
])

watch(() => addTorrentModal.value.show, (val) => {
  showAddModal.value = val
})

watch(() => addTorrentModal.value.tab, (val) => {
  activeTab.value = val
})

watch(showAddModal, (val) => {
  addTorrentModal.value.show = val
  if (!val) {
    addTorrentModal.value.tab = 'file'
  }
})

function openMagnetTab() {
  addTorrentModal.value.tab = 'magnet'
  addTorrentModal.value.show = true
}

function handleTorrentAdded() {
  refresh()
}

const queueCount = computed(() => count.value)
</script>

<template>
  <div class="p-2 sm:p-3">
    <!-- Header -->
    <div class="mb-3 bracket-lg px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-ink-0">
            {{ t('torrents.title') }}
          </h1>
          <p class="header-meta">
            {{ queueCount }} {{ t('torrents.inQueue') }} · rtorrent connected · 0.0 MB/s ↓ · 0.0 MB/s ↑
          </p>
        </div>
        <div class="hidden sm:flex items-center gap-2 shrink-0">
          <UButtonBracket
            variant="bracket"
            @click="openMagnetTab"
          >
            {{ t('torrents.pasteMagnet') }}
          </UButtonBracket>
          <UButtonBracket
            variant="bracket"
            icon="i-heroicons-plus"
            @click="showAddModal = true"
          >
            {{ t('torrents.addTorrent') }}
          </UButtonBracket>
        </div>
      </div>
      <span class="bl" /><span class="br2" />
    </div>

    <!-- Search + filter -->
    <SearchFilter
      v-model:search-model-value="searchQuery"
      v-model:status-model-value="statusFilter"
      :status-options="statusOptions"
      class="mb-3"
    />

    <!-- Loading -->
    <div
      v-if="pending"
      class="flex justify-center py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-6 h-6 animate-spin text-accent"
      />
    </div>

    <!-- Empty state with contextual CTAs -->
    <EmptyState
      v-else-if="filteredTorrents.length === 0"
      :title="t('torrents.noResults')"
      :subtitle="t('torrents.noResultsHint')"
    >
      <div class="flex gap-3 justify-center mt-4 mb-3">
        <UButtonBracket
          variant="bracket"
          @click="showAddModal = true"
        >
          {{ t('torrents.addTorrent') }}
        </UButtonBracket>
        <UButtonBracket
          variant="bracket"
          @click="openMagnetTab"
        >
          {{ t('torrents.pasteMagnet') }} <span class="opacity-60 ml-1">↗</span>
        </UButtonBracket>
      </div>
      <p class="empty-state-meta">
        rtorrent connected · watch folder off · disk free --
      </p>
    </EmptyState>

    <!-- Torrent list -->
    <TorrentList
      v-else
      :torrents="filteredTorrents"
    />

    <!-- Mobile FAB -->
    <UButton
      icon="i-heroicons-plus"
      class="fixed right-3 bottom-16 sm:bottom-20 w-12 h-12 md:hidden btn-primary shadow-lg"
      @click="showAddModal = true"
    />

    <AddTorrentModal
      v-if="showAddModal"
      v-model="showAddModal"
      @added="handleTorrentAdded"
    />
  </div>
</template>
