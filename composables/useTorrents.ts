import type { Torrent } from '~/types'

export const useTorrents = () => {
  const { data: torrents, pending, refresh } = useFetch<Torrent[]>('/api/torrents')

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

  const count = computed(() => filteredTorrents.value.length)

  return {
    torrents,
    pending,
    refresh,
    searchQuery,
    statusFilter,
    filteredTorrents,
    count,
  }
}

export const useTorrentActions = (refreshFn?: () => void) => {
  const start = async (hash: string) => {
    await $fetch(`/api/torrents/${hash}/start`, { method: 'POST' })
    refreshFn?.()
  }

  const stop = async (hash: string) => {
    await $fetch(`/api/torrents/${hash}/stop`, { method: 'POST' })
    refreshFn?.()
  }

  const remove = async (hash: string) => {
    await $fetch(`/api/torrents/${hash}`, { method: 'DELETE' })
    refreshFn?.()
  }

  return {
    start,
    stop,
    remove,
  }
}
