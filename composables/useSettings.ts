import type { AppSettings } from '~/types'

export const useSettings = () => {
  const { data: settings, pending, refresh } = useFetch<AppSettings>('/api/settings')

  const saveSettings = async (data: Partial<AppSettings>) => {
    await $fetch('/api/settings', {
      method: 'PATCH',
      body: data,
    })
    refresh()
  }

  const testConnection = async (client: string, config: Record<string, string | number>) => {
    await $fetch('/api/client/test', {
      method: 'POST',
      body: { client, ...config },
    })
  }

  return {
    settings,
    pending,
    refresh,
    saveSettings,
    testConnection,
  }
}
