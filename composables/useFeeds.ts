import type { Feed } from '~/types'

export const useFeeds = () => {
  const { data: feeds, refresh } = useFetch<Feed[]>('/api/feeds')

  const addFeed = async (url: string) => {
    await $fetch('/api/feeds', {
      method: 'POST',
      body: { url },
    })
    refresh()
  }

  const deleteFeed = async (id: number) => {
    await $fetch(`/api/feeds/${id}`, {
      method: 'DELETE',
    })
    refresh()
  }

  return {
    feeds,
    refresh,
    addFeed,
    deleteFeed,
  }
}
