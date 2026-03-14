<script setup lang="ts">
import type { Torrent } from '~/types'

interface Props {
  torrent: Torrent
}

const props = defineProps<Props>()

const { t } = useI18n()
const { formatSize, formatSpeed, getProgressPercent } = useFormatters()

const progress = computed(() => getProgressPercent(props.torrent.completed, props.torrent.size))
</script>

<template>
  <div class="bracket p-3">
    <div class="flex items-center gap-3">
      <CircularProgress
        :progress="progress"
        :state="torrent.state"
        size="md"
      />

      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold truncate text-ink-0">
          {{ torrent.name || t('torrents.unknown') }}
        </p>
        <div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-ink-3/60 mt-1">
          <span>{{ formatSize(torrent.size) }}</span>
          <span
            v-if="torrent.downloadSpeed"
            class="text-accent"
          >↓ {{ formatSpeed(torrent.downloadSpeed) }}/s</span>
          <span v-if="torrent.uploadSpeed">↑ {{ formatSpeed(torrent.uploadSpeed) }}/s</span>
          <span>{{ torrent.seeds || 0 }}/{{ torrent.peers || 0 }} peers</span>
        </div>
      </div>

      <StatusBadge :state="torrent.state" />
    </div>
    <span class="bl" /><span class="br2" />
  </div>
</template>
