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
  <div
    class="grid grid-cols-12 gap-2 px-2 py-2 text-xs transition-colors items-center border-b border-scan/10 hover:bg-electric/20"
  >
    <div class="col-span-4 flex items-center gap-2 min-w-0">
      <div class="w-14 flex-shrink-0">
        <LinearProgressBar
          :progress="progress"
          :state="torrent.state"
          size="sm"
        />
      </div>
      <span class="truncate text-ink-3">{{ torrent.name || t('torrents.unknown') }}</span>
    </div>

    <div class="col-span-1 text-right font-mono text-ink-3/70">
      {{ formatSize(torrent.size) }}
    </div>

    <div class="col-span-1 text-right font-mono text-accent">
      {{ formatSpeed(torrent.downloadSpeed) }}/s
    </div>

    <div class="col-span-1 text-right font-mono text-ink-3/70">
      {{ formatSpeed(torrent.uploadSpeed) }}/s
    </div>

    <div class="col-span-1 text-right font-mono text-ink-3/60">
      {{ torrent.seeds || 0 }}/{{ torrent.peers || 0 }}
    </div>

    <div class="col-span-1 text-right font-mono text-ink-3/70">
      {{ (torrent.ratio || 0).toFixed(2) }}
    </div>

    <div class="col-span-1 text-center">
      <StatusBadge :state="torrent.state" />
    </div>

    <div class="col-span-2 text-right font-mono text-ink-3/50">
      {{ torrent.addedAt ? new Date(torrent.addedAt).toLocaleDateString() : '-' }}
    </div>
  </div>
</template>
