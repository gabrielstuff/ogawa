<script setup lang="ts">
import type { AppSettings } from '~/types'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Settings - Ogawa',
})

const { data: settings, pending, refresh } = await useFetch<AppSettings>('/api/settings')

const isLoading = ref(false)
const testStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle')
const testMessage = ref('')

// Connection settings
const clientUrl = ref('')
const clientUsername = ref('')
const clientPassword = ref('')

// UI settings
const theme = ref('system')
const itemsPerPage = ref(20)

// Download settings
const defaultDownloadPath = ref('')
const maxActiveDownloads = ref(3)
const downloadSpeedLimit = ref(0)
const uploadSpeedLimit = ref(0)

const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

onMounted(() => {
  if (settings.value) {
    clientUrl.value = settings.value.client?.url || ''
    clientUsername.value = settings.value.client?.username || ''
    clientPassword.value = settings.value.client?.password || ''
    theme.value = settings.value.ui?.theme || 'system'
    itemsPerPage.value = settings.value.ui?.itemsPerPage || 20
    defaultDownloadPath.value = settings.value.download?.defaultPath || ''
    maxActiveDownloads.value = settings.value.download?.maxActive || 3
    downloadSpeedLimit.value = settings.value.download?.downloadSpeedLimit || 0
    uploadSpeedLimit.value = settings.value.download?.uploadSpeedLimit || 0
  }
})

async function saveSettings() {
  isLoading.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PATCH',
      body: {
        client: {
          url: clientUrl.value,
          username: clientUsername.value,
          password: clientPassword.value,
        },
        ui: {
          theme: theme.value,
          itemsPerPage: itemsPerPage.value,
        },
        download: {
          defaultPath: defaultDownloadPath.value,
          maxActive: maxActiveDownloads.value,
          downloadSpeedLimit: downloadSpeedLimit.value,
          uploadSpeedLimit: uploadSpeedLimit.value,
        },
      },
    })
    refresh()
  } catch (e) {
    console.error('Failed to save settings:', e)
  } finally {
    isLoading.value = false
  }
}

async function testConnection() {
  testStatus.value = 'testing'
  testMessage.value = ''

  try {
    await $fetch('/api/client/test', {
      method: 'POST',
      body: {
        url: clientUrl.value,
        username: clientUsername.value,
        password: clientPassword.value,
      },
    })
    testStatus.value = 'success'
    testMessage.value = 'Connection successful!'
  } catch (e: any) {
    testStatus.value = 'error'
    testMessage.value = e.message || 'Connection failed'
  }
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    <div v-if="pending" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="space-y-6">
      <!-- Connection Settings -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-server-stack" class="w-5 h-5" />
            Connection
          </h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">qBittorrent URL</label>
            <UInput
              v-model="clientUrl"
              placeholder="http://localhost:8080"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Username</label>
            <UInput
              v-model="clientUsername"
              placeholder="admin"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <UInput
              v-model="clientPassword"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div class="flex gap-2">
            <UButton
              :loading="testStatus === 'testing'"
              variant="outline"
              @click="testConnection"
            >
              Test Connection
            </UButton>
          </div>

          <UAlert
            v-if="testStatus === 'success'"
            color="success"
            variant="solid"
          >
            {{ testMessage }}
          </UAlert>

          <UAlert
            v-if="testStatus === 'error'"
            color="error"
            variant="solid"
          >
            {{ testMessage }}
          </UAlert>
        </div>
      </UCard>

      <!-- UI Settings -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-paint-brush" class="w-5 h-5" />
            Interface
          </h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Theme</label>
            <USelect
              v-model="theme"
              :options="themeOptions"
              option-attribute="label"
              value-attribute="value"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Items per page</label>
            <UInput
              v-model="itemsPerPage"
              type="number"
              min="10"
              max="100"
            />
          </div>
        </div>
      </UCard>

      <!-- Download Settings -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-down-circle" class="w-5 h-5" />
            Downloads
          </h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Default download path</label>
            <UInput
              v-model="defaultDownloadPath"
              placeholder="/downloads"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Max active downloads</label>
            <UInput
              v-model="maxActiveDownloads"
              type="number"
              min="1"
              max="50"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Download speed limit (KB/s)</label>
              <UInput
                v-model="downloadSpeedLimit"
                type="number"
                min="0"
                placeholder="0 = unlimited"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Upload speed limit (KB/s)</label>
              <UInput
                v-model="uploadSpeedLimit"
                type="number"
                min="0"
                placeholder="0 = unlimited"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Save Button -->
      <div class="flex justify-end">
        <UButton
          :loading="isLoading"
          size="lg"
          @click="saveSettings"
        >
          Save Settings
        </UButton>
      </div>
    </div>
  </div>
</template>
