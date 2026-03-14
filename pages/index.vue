<script setup lang="ts">
import type { Torrent } from '~/types'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Torrents - Ogawa',
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

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'downloading', label: 'Downloading' },
  { value: 'seeding', label: 'Seeding' },
  { value: 'paused', label: 'Paused' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'error', label: 'Error' },
]

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

const selectedTorrents = ref<Set<string>>(new Set())

function toggleSelect(hash: string) {
  if (selectedTorrents.value.has(hash)) {
    selectedTorrents.value.delete(hash)
  } else {
    selectedTorrents.value.add(hash)
  }
}

function toggleAll() {
  if (selectedTorrents.value.size === filteredTorrents.value.length) {
    selectedTorrents.value.clear()
  } else {
    selectedTorrents.value = new Set(filteredTorrents.value.map(t => t.hash))
  }
}
</script>

<template>
  <div class="p-2 sm:p-3">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-xl font-semibold">Torrents</h1>
      <UButton
        icon="i-heroicons-arrow-path"
        variant="ghost"
        size="sm"
        @click="refresh()"
      />
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-2 mb-3">
      <UInput
        v-model="searchQuery"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="flex-1"
      />
      <USelect
        v-model="statusFilter"
        :options="statusOptions"
        option-attribute="label"
        value-attribute="value"
        size="sm"
        class="w-full sm:w-32"
      />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTorrents.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-cloud-arrow-down" class="w-12 h-12 mx-auto text-gray-600 mb-3" />
      <p class="text-gray-400 text-sm mb-4">No torrents yet</p>
      <NuxtLink to="/add">
        <UButton size="sm">Add torrent</UButton>
      </NuxtLink>
    </div>

    <!-- Torrent List -->
    <div v-else>
      <!-- Desktop Table Header -->
      <div class="hidden md:grid grid-cols-12 gap-2 px-2 py-1.5 text-[11px] text-gray-500 font-medium uppercase tracking-wide">
        <div class="col-span-4">Name</div>
        <div class="col-span-1 text-right">Size</div>
        <div class="col-span-1 text-right">Down</div>
        <div class="col-span-1 text-right">Up</div>
        <div class="col-span-1 text-right">S/P</div>
        <div class="col-span-1 text-right">Ratio</div>
        <div class="col-span-1 text-center">%</div>
        <div class="col-span-2 text-right">Added</div>
      </div>

      <!-- Desktop Torrent Rows -->
      <div class="hidden md:block space-y-0.5">
        <div
          v-for="torrent in filteredTorrents"
          :key="torrent.hash"
          class="grid grid-cols-12 gap-2 px-2 py-1.5 text-xs rounded hover:bg-gray-800/60 transition-colors items-center"
        >
          <!-- Name with inline progress -->
          <div class="col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-14 h-1.5 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
              <div 
                class="h-full transition-all"
                :class="`bg-${getProgressColor(torrent.state)}-500`"
                :style="{ width: `${getProgressPercent(torrent.completed, torrent.size)}%` }"
              />
            </div>
            <span class="truncate">{{ torrent.name || 'Unknown' }}</span>
          </div>
          
          <!-- Size -->
          <div class="col-span-1 text-right text-gray-400">{{ formatSize(torrent.size) }}</div>
          
          <!-- Down -->
          <div class="col-span-1 text-right text-gray-400">{{ formatSpeed(torrent.downloadSpeed) }}</div>
          
          <!-- Up -->
          <div class="col-span-1 text-right text-gray-400">{{ formatSpeed(torrent.uploadSpeed) }}</div>
          
          <!-- Seeds/Peers -->
          <div class="col-span-1 text-right text-gray-400">{{ torrent.seeds || 0 }}/{{ torrent.peers || 0 }}</div>
          
          <!-- Ratio -->
          <div class="col-span-1 text-right text-gray-400">{{ (torrent.ratio || 0).toFixed(2) }}</div>
          
          <!-- Progress -->
          <div class="col-span-1 text-center">
            <span 
              class="text-[10px] font-medium px-1.5 py-0.5 rounded"
              :class="{
                'bg-primary-500/20 text-primary-400': torrent.state === 'downloading',
                'bg-success-500/20 text-success-400': torrent.state === 'seeding',
                'bg-warning-500/20 text-warning-400': torrent.state === 'paused',
                'bg-error-500/20 text-error-400': torrent.state === 'error',
                'bg-gray-700 text-gray-400': !torrent.state || torrent.state === 'stopped'
              }"
            >
              {{ getProgressPercent(torrent.completed, torrent.size) }}%
            </span>
          </div>
          
          <!-- Added -->
          <div class="col-span-2 text-right text-gray-500">
            {{ torrent.addedAt ? new Date(torrent.addedAt).toLocaleDateString() : '-' }}
          </div>
        </div>
      </div>

      <!-- Mobile Torrent Cards -->
      <div class="md:hidden space-y-2">
        <div
          v-for="torrent in filteredTorrents"
          :key="torrent.hash"
          class="bg-gray-800/50 rounded-lg p-3"
        >
          <div class="flex items-center gap-3">
            <!-- Progress Ring -->
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    class="text-gray-700"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  />
                  <path
                    :class="`text-${getProgressColor(torrent.state)}-500`"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    :stroke-dasharray="`${getProgressPercent(torrent.completed, torrent.size)}, 100`"
                  />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                  {{ getProgressPercent(torrent.completed, torrent.size) }}%
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ torrent.name || 'Unknown' }}</p>
              <div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 mt-1">
                <span>{{ formatSize(torrent.size) }}</span>
                <span v-if="torrent.downloadSpeed">↓ {{ formatSpeed(torrent.downloadSpeed) }}/s</span>
                <span v-if="torrent.uploadSpeed">↑ {{ formatSpeed(torrent.uploadSpeed) }}/s</span>
                <span>{{ torrent.seeds || 0 }}S / {{ torrent.peers || 0 }}P</span>
              </div>
            </div>

            <!-- State Badge -->
            <span 
              class="text-[10px] font-medium px-2 py-1 rounded flex-shrink-0"
              :class="{
                'bg-primary-500/20 text-primary-400': torrent.state === 'downloading',
                'bg-success-500/20 text-success-400': torrent.state === 'seeding',
                'bg-warning-500/20 text-warning-400': torrent.state === 'paused',
                'bg-error-500/20 text-error-400': torrent.state === 'error',
                'bg-gray-700 text-gray-400': !torrent.state || torrent.state === 'stopped'
              }"
            >
              {{ torrent.state || 'stopped' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <NuxtLink
      to="/add"
      class="fixed right-3 bottom-16 sm:bottom-3 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-400 transition-colors md:hidden"
    >
      <UIcon name="i-heroicons-plus" class="w-5 h-5" />
    </NuxtLink>
  </div>
</template>
