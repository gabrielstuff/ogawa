<script setup lang="ts">
import type { Torrent } from '~/types'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('nav.torrents')} - Ogawa`),
})

const { data: torrents, pending, refresh } = await useFetch<Torrent[]>('/api/torrents')

const searchQuery = ref('')
const statusFilter = ref('all')

const filteredTorrents = computed(() => {
  if (!torrents.value) return []

  let result = torrents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => (t.name || '').toLowerCase().includes(query))
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(t => t.state === statusFilter.value)
  }

  return result
})

const statusOptions = computed(() => [
  { value: 'all', label: t('status.all') },
  { value: 'downloading', label: t('status.downloading') },
  { value: 'seeding', label: t('status.seeding') },
  { value: 'paused', label: t('status.paused') },
  { value: 'stopped', label: t('status.stopped') },
  { value: 'error', label: t('status.error') },
])

function formatSize(bytes: number | undefined | null): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatSpeed(bytesPerSecond: number | undefined | null): string {
  if (!bytesPerSecond || bytesPerSecond === 0) return '0'
  return formatSize(bytesPerSecond)
}

function getProgressPercent(completed: number | undefined | null, total: number | undefined | null): number {
  if (!total || total === 0) return 0
  if (!completed) return 0
  return Math.min(100, Math.round((completed / total) * 100))
}

function getProgressColor(state: string | undefined): string {
  switch (state) {
    case 'seeding': return 'success'
    case 'downloading': return 'primary'
    case 'paused': return 'warning'
    case 'error': return 'error'
    default: return 'neutral'
  }
}

const queueCount = computed(() => filteredTorrents.value.length)
</script>

<template>
  <div class="p-2 sm:p-3">
    <!-- Header with operational metadata -->
    <div class="mb-4 bracket-lg px-4 py-3">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-ink-0">
            {{ t('torrents.title') }}
          </h1>
          <p class="header-meta">
            {{ queueCount }} in queue · rtorrent connected · 0.0 MB/s ↓ · 0.0 MB/s ↑
          </p>
        </div>
        <UButtonBracket
          variant="bracket"
          icon="i-heroicons-arrow-path"
          size="sm"
          @click="refresh()"
        />
      </div>
      <span class="bl"></span><span class="br2"></span>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-2 mb-3">
      <div class="input-bracket flex-1">
        <UInput
          v-model="searchQuery"
          :placeholder="t('torrents.search')"
          icon="i-heroicons-magnifying-glass"
          size="sm"
          class="w-full"
        />
        <span class="bl"></span><span class="br2"></span>
      </div>
      <USelect
        v-model="statusFilter"
        :options="statusOptions"
        option-attribute="label"
        value-attribute="value"
        size="sm"
        color="neutral"
        variant="outline"
        class="w-full sm:w-32"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex justify-center py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-6 h-6 animate-spin text-accent"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredTorrents.length === 0"
      class="empty-state bracket-lg"
    >
      <div class="empty-state-title">
        {{ t('torrents.noResults') }}
      </div>
      <div class="empty-state-sub">
        Add a .torrent file, paste a magnet link, or pull items from a feed.
      </div>
      <div class="flex gap-3 justify-center mb-4">
        <NuxtLink to="/add">
          <UButtonBracket variant="bracket">
            + Add torrent
          </UButtonBracket>
        </NuxtLink>
        <NuxtLink to="/add?tab=magnet">
          <UButtonBracket variant="bracket">
            Paste magnet <span class="opacity-60">↗</span>
          </UButtonBracket>
        </NuxtLink>
      </div>
      <div class="empty-state-meta">
        rtorrent connected · watch folder off · disk free --
      </div>
      <span class="bl"></span><span class="br2"></span>
    </div>

    <!-- Torrent List -->
    <div v-else>
      <!-- Desktop Table Header -->
      <div class="hidden md:grid grid-cols-12 gap-2 px-2 py-1.5 text-[10px] text-ink-3 font-mono uppercase tracking-widest">
        <div class="col-span-4">
          {{ t('torrents.name') }}
        </div>
        <div class="col-span-1 text-right">
          {{ t('torrents.size') }}
        </div>
        <div class="col-span-1 text-right">
          {{ t('torrents.down') }}
        </div>
        <div class="col-span-1 text-right">
          {{ t('torrents.up') }}
        </div>
        <div class="col-span-1 text-right">
          {{ t('torrents.sp') }}
        </div>
        <div class="col-span-1 text-right">
          {{ t('torrents.ratio') }}
        </div>
        <div class="col-span-1 text-center">
          {{ t('torrents.percent') }}
        </div>
        <div class="col-span-2 text-right">
          {{ t('torrents.added') }}
        </div>
      </div>

      <!-- Desktop Torrent Rows -->
      <div class="hidden md:block space-y-0.5">
        <div
          v-for="torrent in filteredTorrents"
          :key="torrent.hash"
          class="grid grid-cols-12 gap-2 px-2 py-2 text-xs transition-colors items-center border-b border-scan/10 hover:bg-electric/20"
        >
          <!-- Name with inline progress -->
          <div class="col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-14 h-1.5 bg-line/30 overflow-hidden flex-shrink-0">
              <div
                class="h-full transition-all"
                :class="{
                  'bg-accent-t': torrent.state === 'downloading',
                  'bg-accent': torrent.state === 'seeding',
                  'bg-flicker': torrent.state === 'paused',
                  'bg-red-500': torrent.state === 'error',
                }"
                :style="{ width: `${getProgressPercent(torrent.completed, torrent.size)}%` }"
              />
            </div>
            <span class="truncate text-ink-3">{{ torrent.name || t('torrents.unknown') }}</span>
          </div>

          <!-- Size -->
          <div class="col-span-1 text-right font-mono text-ink-3/70">
            {{ formatSize(torrent.size) }}
          </div>

          <!-- Down -->
          <div class="col-span-1 text-right font-mono text-accent">
            {{ formatSpeed(torrent.downloadSpeed) }}/s
          </div>

          <!-- Up -->
          <div class="col-span-1 text-right font-mono text-ink-3/70">
            {{ formatSpeed(torrent.uploadSpeed) }}/s
          </div>

          <!-- Seeds/Peers -->
          <div class="col-span-1 text-right font-mono text-ink-3/60">
            {{ torrent.seeds || 0 }}/{{ torrent.peers || 0 }}
          </div>

          <!-- Ratio -->
          <div class="col-span-1 text-right font-mono text-ink-3/70">
            {{ (torrent.ratio || 0).toFixed(2) }}
          </div>

          <!-- Progress -->
          <div class="col-span-1 text-center">
            <span
              class="text-[10px] font-mono font-medium px-1.5 py-0.5"
              :class="{
                'bg-accent-t/20 text-accent': torrent.state === 'downloading',
                'bg-accent/20 text-ink-0': torrent.state === 'seeding',
                'bg-flicker/20 text-flicker': torrent.state === 'paused',
                'bg-red-500/20 text-red-400': torrent.state === 'error',
                'bg-line/30 text-ink-3/50': !torrent.state || torrent.state === 'stopped',
              }"
            >
              {{ getProgressPercent(torrent.completed, torrent.size) }}%
            </span>
          </div>

          <!-- Added -->
          <div class="col-span-2 text-right font-mono text-ink-3/50">
            {{ torrent.addedAt ? new Date(torrent.addedAt).toLocaleDateString() : '-' }}
          </div>
        </div>
      </div>

      <!-- Mobile Torrent Cards -->
      <div class="md:hidden space-y-2">
        <div
          v-for="torrent in filteredTorrents"
          :key="torrent.hash"
          class="bracket p-3"
        >
          <div class="flex items-center gap-3">
            <!-- Progress Ring -->
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10">
                <svg
                  class="w-full h-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    class="text-scan/30"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  />
                  <path
                    :class="{
                      'text-accent': torrent.state === 'downloading',
                      'text-ink-0': torrent.state === 'seeding',
                      'text-flicker': torrent.state === 'paused',
                      'text-red-400': torrent.state === 'error',
                    }"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    :stroke-dasharray="`${getProgressPercent(torrent.completed, torrent.size)}, 100`"
                  />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium text-ink-0">
                  {{ getProgressPercent(torrent.completed, torrent.size) }}%
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate text-ink-0">
                {{ torrent.name || t('torrents.unknown') }}
              </p>
              <div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-ink-3/60 mt-1">
                <span>{{ formatSize(torrent.size) }}</span>
                <span v-if="torrent.downloadSpeed" class="text-accent">↓ {{ formatSpeed(torrent.downloadSpeed) }}/s</span>
                <span v-if="torrent.uploadSpeed">↑ {{ formatSpeed(torrent.uploadSpeed) }}/s</span>
                <span>{{ torrent.seeds || 0 }}/{{ torrent.peers || 0 }} peers</span>
              </div>
            </div>

            <!-- State Badge -->
            <span
              class="text-[10px] font-mono font-medium px-2 py-1 flex-shrink-0"
              :class="{
                'bg-accent-t/20 text-accent': torrent.state === 'downloading',
                'bg-accent/20 text-ink-0': torrent.state === 'seeding',
                'bg-flicker/20 text-flicker': torrent.state === 'paused',
                'bg-red-500/20 text-red-400': torrent.state === 'error',
                'bg-line/30 text-ink-3/50': !torrent.state || torrent.state === 'stopped',
              }"
            >
              {{ torrent.state ? t(`status.${torrent.state}`) : t('status.stopped') }}
            </span>
          </div>
          <span class="bl"></span><span class="br2"></span>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <NuxtLink
      to="/add"
      class="fixed right-3 bottom-16 sm:bottom-20 w-12 h-12 flex items-center justify-center shadow-lg transition-colors md:hidden btn-primary"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-5 h-5"
      />
    </NuxtLink>
  </div>
</template>
