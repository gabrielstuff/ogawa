<script setup lang="ts">
import type { Torrent } from '~/types'

interface Props {
  torrents: Torrent[]
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div>
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

    <div class="hidden md:block space-y-0.5">
      <TorrentRow
        v-for="torrent in torrents"
        :key="torrent.hash"
        :torrent="torrent"
      />
    </div>

    <div class="md:hidden space-y-2">
      <TorrentCard
        v-for="torrent in torrents"
        :key="torrent.hash"
        :torrent="torrent"
      />
    </div>
  </div>
</template>
