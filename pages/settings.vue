<script setup lang="ts">
import type { AppSettings } from '~/types'

definePageMeta({
  layout: 'default',
})

const { t, locale, locales, setLocale } = useI18n()

useHead({
  title: computed(() => `${t('settings.title')} - Ogawa`),
})

const { data: settings, pending, refresh } = await useFetch<AppSettings>('/api/settings')

const isLoading = ref(false)
const testStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle')
const testMessage = ref('')

// Connection settings
const clientType = ref('qBittorrent')
const clientUrl = ref('')
const clientUsername = ref('')
const clientPassword = ref('')
const clientHost = ref('')
const clientPort = ref(58846)

// UI settings
const theme = ref('system')
const itemsPerPage = ref(20)

// Download settings
const defaultDownloadPath = ref('')
const maxActiveDownloads = ref(3)
const downloadSpeedLimit = ref(0)
const uploadSpeedLimit = ref(0)

const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') },
])

const localeOptions = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    value: l.code,
    label: l.name,
  })),
)

const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    setLocale(val)
  },
})

const clientOptions = [
  { value: 'qBittorrent', label: 'qBittorrent' },
  { value: 'Transmission', label: 'Transmission' },
  { value: 'rTorrent', label: 'rTorrent' },
  { value: 'Deluge', label: 'Deluge' },
]

const showQBitFields = computed(() => clientType.value === 'qBittorrent')
const showTransmissionFields = computed(() => clientType.value === 'Transmission')
const showRTorrentFields = computed(() => clientType.value === 'rTorrent')
const showDelugeFields = computed(() => clientType.value === 'Deluge')

onMounted(() => {
  if (settings.value) {
    clientType.value = settings.value.client?.client || 'qBittorrent'
    clientUrl.value = settings.value.client?.url || ''
    clientUsername.value = settings.value.client?.username || ''
    clientPassword.value = settings.value.client?.password || ''
    clientHost.value = (settings.value.client as any)?.host || ''
    clientPort.value = (settings.value.client as any)?.port || 58846
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
    const clientData: Record<string, any> = {
      client: clientType.value,
    }

    if (showQBitFields.value) {
      clientData.url = clientUrl.value
      clientData.username = clientUsername.value
      clientData.password = clientPassword.value
    }
    else if (showTransmissionFields.value) {
      clientData.url = clientUrl.value
      clientData.username = clientUsername.value
      clientData.password = clientPassword.value
    }
    else if (showRTorrentFields.value) {
      clientData.url = clientUrl.value
    }
    else if (showDelugeFields.value) {
      clientData.host = clientHost.value
      clientData.port = clientPort.value
      clientData.password = clientPassword.value
    }

    await $fetch('/api/settings', {
      method: 'PATCH',
      body: {
        client: clientData,
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
  }
  catch (e) {
    console.error('Failed to save settings:', e)
  }
  finally {
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
        client: clientType.value,
        url: clientUrl.value,
        username: clientUsername.value,
        password: clientPassword.value,
        host: clientHost.value,
        port: clientPort.value,
      },
    })
    testStatus.value = 'success'
    testMessage.value = t('settings.connectionSuccess')
  }
  catch (e: any) {
    testStatus.value = 'error'
    testMessage.value = e.message || t('settings.connectionFailed')
  }
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-6 bracket-lg px-4 py-3">
      <h1 class="text-2xl font-bold text-ink-0">
        {{ t('settings.title') }}
      </h1>
      <p class="header-meta">
        Configure torrent client connection and download settings
      </p>
      <span class="bl"></span><span class="br2"></span>
    </div>

    <div
      v-if="pending"
      class="flex justify-center py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-accent"
      />
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <!-- Connection Settings -->
      <div class="bracket p-4">
        <div class="flex items-center gap-2 mb-4">
          <UIcon
            name="i-heroicons-server-stack"
            class="w-5 h-5 text-accent"
          />
          <h2 class="text-lg font-bold text-ink-0">{{ t('settings.connection') }}</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.torrentClient') }}</label>
            <USelect
              v-model="clientType"
              :options="clientOptions"
              option-attribute="label"
              value-attribute="value"
              color="neutral"
              variant="outline"
              class="w-full"
            />
          </div>

          <!-- qBittorrent Fields -->
          <div v-if="showQBitFields" class="space-y-3">
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.clientUrl', { client: 'qBittorrent' }) }}</label>
              <UInput
                v-model="clientUrl"
                placeholder="http://localhost:8080"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.username') }}</label>
              <UInput
                v-model="clientUsername"
                placeholder="admin"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
              <UInput
                v-model="clientPassword"
                type="password"
                placeholder="••••••••"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>

          <!-- Transmission Fields -->
          <div v-if="showTransmissionFields" class="space-y-3">
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.clientUrl', { client: 'Transmission' }) }}</label>
              <UInput
                v-model="clientUrl"
                placeholder="http://localhost:9091"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.username') }}</label>
              <UInput
                v-model="clientUsername"
                placeholder="admin"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
              <UInput
                v-model="clientPassword"
                type="password"
                placeholder="••••••••"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>

          <!-- rTorrent Fields -->
          <div v-if="showRTorrentFields">
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.scgiUrl') }}</label>
            <UInput
              v-model="clientUrl"
              placeholder="localhost:5000"
              color="neutral"
              variant="outline"
            />
          </div>

          <!-- Deluge Fields -->
          <div v-if="showDelugeFields" class="space-y-3">
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.host') }}</label>
              <UInput
                v-model="clientHost"
                placeholder="localhost"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.port') }}</label>
              <UInput
                v-model="clientPort"
                type="number"
                placeholder="58846"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
              <UInput
                v-model="clientPassword"
                type="password"
                placeholder="••••••••"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            <UButtonBracket
              variant="bracket"
              :loading="testStatus === 'testing'"
              @click="testConnection"
            >
              {{ t('settings.testConnection') }}
            </UButtonBracket>
          </div>

          <UAlert
            v-if="testStatus === 'success'"
            color="success"
            variant="solid"
            class="font-mono"
          >
            {{ testMessage }}
          </UAlert>

          <UAlert
            v-if="testStatus === 'error'"
            color="error"
            variant="solid"
            class="font-mono"
          >
            {{ testMessage }}
          </UAlert>
        </div>
        <span class="bl"></span><span class="br2"></span>
      </div>

      <!-- UI Settings -->
      <div class="bracket p-4">
        <div class="flex items-center gap-2 mb-4">
          <UIcon
            name="i-heroicons-paint-brush"
            class="w-5 h-5 text-accent"
          />
          <h2 class="text-lg font-bold text-ink-0">{{ t('settings.interface') }}</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.theme') }}</label>
            <USelect
              v-model="theme"
              :options="themeOptions"
              option-attribute="label"
              value-attribute="value"
              color="neutral"
              variant="outline"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.language') }}</label>
            <USelect
              v-model="currentLocale"
              :items="localeOptions"
              option-attribute="label"
              value-attribute="value"
              color="neutral"
              variant="outline"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.itemsPerPage') }}</label>
            <UInput
              v-model="itemsPerPage"
              type="number"
              min="10"
              max="100"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
        <span class="bl"></span><span class="br2"></span>
      </div>

      <!-- Download Settings -->
      <div class="bracket p-4">
        <div class="flex items-center gap-2 mb-4">
          <UIcon
            name="i-heroicons-arrow-down-circle"
            class="w-5 h-5 text-accent"
          />
          <h2 class="text-lg font-bold text-ink-0">{{ t('settings.downloads') }}</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.defaultDownloadPath') }}</label>
            <UInput
              v-model="defaultDownloadPath"
              placeholder="/downloads"
              color="neutral"
              variant="outline"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.maxActiveDownloads') }}</label>
            <UInput
              v-model="maxActiveDownloads"
              type="number"
              min="1"
              max="50"
              color="neutral"
              variant="outline"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.downloadSpeedLimit') }}</label>
              <UInput
                v-model="downloadSpeedLimit"
                type="number"
                min="0"
                :placeholder="t('settings.unlimited')"
                color="neutral"
                variant="outline"
              />
            </div>
            <div>
              <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.uploadSpeedLimit') }}</label>
              <UInput
                v-model="uploadSpeedLimit"
                type="number"
                min="0"
                :placeholder="t('settings.unlimited')"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>
        </div>
        <span class="bl"></span><span class="br2"></span>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <UButtonBracket
          variant="bracket"
          :loading="isLoading"
          size="lg"
          @click="saveSettings"
        >
          {{ t('settings.save') }}
        </UButtonBracket>
      </div>
    </div>
  </div>
</template>
