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
    <div class="mb-3 bracket-lg px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-ink-0">
            {{ t('torrents.title') }}
          </h1>
          <p class="header-meta">
            {{ queueCount }} {{ t('torrents.inQueue') }}
          </p>
        </div>
        <div class="hidden sm:flex items-center gap-2 shrink-0">
          <UButton
            variant="ghost"
            class="btn-ghost font-mono text-xs"
            @click="openMagnetTab"
          >
            {{ t('torrents.pasteMagnet') }}
          </UButton>
          <UButtonBracket
            variant="bracket"
            icon="i-heroicons-plus"
            @click="showAddModal = true"
          >
            {{ t('torrents.addTorrent') }}
          </UButtonBracket>
        </div>
        <UButtonBracket
          variant="bracket"
          icon="i-heroicons-arrow-path"
          size="sm"
          class="sm:hidden"
          @click="refresh()"
        />
      </div>
      <span class="bl" /><span class="br2" />
    </div>

    <SearchFilter
      v-model:search-model-value="searchQuery"
      v-model:status-model-value="statusFilter"
      :status-options="statusOptions"
      class="mb-3"
    />

    <div
      v-if="pending"
      class="flex justify-center py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-6 h-6 animate-spin text-accent"
      />
    </div>

    <EmptyState
      v-else-if="filteredTorrents.length === 0"
      :title="t('torrents.noResults')"
      :subtitle="t('torrents.noResultsHint')"
    />

    <TorrentList
      v-else
      :torrents="filteredTorrents"
    />

    <button
      class="fixed right-3 bottom-16 sm:bottom-20 w-12 h-12 flex items-center justify-center shadow-lg transition-colors md:hidden btn-primary"
      @click="showAddModal = true"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-5 h-5"
      />
    </button>

    <AddTorrentModal
      v-if="showAddModal"
      v-model="showAddModal"
      @added="handleTorrentAdded"
    />
  </div>
</template>
