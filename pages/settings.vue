<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t, locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const toast = useToast()

useHead({
  title: computed(() => `${t('settings.title')} - Ogawa`),
})

const { settings, pending, refresh, saveSettings, testConnection } = useSettings()

const isLoading = ref(false)
const isTesting = ref(false)

const clientType = ref('qBittorrent')
const clientUrl = ref('')
const clientUsername = ref('')
const clientPassword = ref('')
const clientHost = ref('')
const clientPort = ref(58846)

const theme = ref(colorMode.value === 'system' ? 'system' : colorMode.value)
const currentLocale = ref(locale.value)
const itemsPerPage = ref(20)

const defaultPath = ref('')
const maxActive = ref(3)
const downloadLimit = ref(0)
const uploadLimit = ref(0)

const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') },
])

const localeOptions = computed(() =>
  (locales.value as Array<{ code: string, name: string }>).map(l => ({
    value: l.code,
    label: l.name,
  })),
)

watch(theme, async (newTheme) => {
  colorMode.value = newTheme
  await saveSettings({ ui: { theme: newTheme } })
})

watch(currentLocale, (newLocale) => {
  setLocale(newLocale)
})

watch(clientType, async (newClient) => {
  await saveSettings({ client: { client: newClient } })
})

onMounted(() => {
  if (settings.value) {
    clientType.value = settings.value.client?.client || 'qBittorrent'
    clientUrl.value = settings.value.client?.url || ''
    clientUsername.value = settings.value.client?.username || ''
    clientPassword.value = settings.value.client?.password || ''
    clientHost.value = (settings.value.client as Record<string, unknown>)?.host as string || ''
    clientPort.value = (settings.value.client as Record<string, unknown>)?.port as number || 58846
    theme.value = settings.value.ui?.theme || 'system'
    currentLocale.value = locale.value
    itemsPerPage.value = settings.value.ui?.itemsPerPage || 20
    defaultPath.value = settings.value.download?.defaultPath || ''
    maxActive.value = settings.value.download?.maxActive || 3
    downloadLimit.value = settings.value.download?.downloadSpeedLimit || 0
    uploadLimit.value = settings.value.download?.uploadSpeedLimit || 0
  }
})

async function handleSaveSettings() {
  isLoading.value = true
  try {
    const clientData: Record<string, unknown> = { client: clientType.value }

    if (clientType.value === 'qBittorrent' || clientType.value === 'Transmission') {
      clientData.url = clientUrl.value
      clientData.username = clientUsername.value
      clientData.password = clientPassword.value
    }
    else if (clientType.value === 'rTorrent') {
      clientData.url = clientUrl.value
    }
    else if (clientType.value === 'Deluge') {
      clientData.host = clientHost.value
      clientData.port = clientPort.value
      clientData.password = clientPassword.value
    }

    await saveSettings({
      client: clientData,
      ui: { theme: theme.value, itemsPerPage: itemsPerPage.value },
      download: {
        defaultPath: defaultPath.value,
        maxActive: maxActive.value,
        downloadSpeedLimit: downloadLimit.value,
        uploadSpeedLimit: uploadLimit.value,
      },
    })
    refresh()
    toast.add({ title: t('settings.saved'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('settings.saveFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isLoading.value = false
  }
}

async function handleTestConnection() {
  isTesting.value = true

  try {
    await testConnection(clientType.value, {
      url: clientUrl.value,
      username: clientUsername.value,
      password: clientPassword.value,
      host: clientHost.value,
      port: clientPort.value,
    })
    toast.add({ title: t('settings.connectionSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('settings.connectionFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isTesting.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <div class="mb-6 bracket-lg px-4 py-3">
      <h1 class="text-2xl font-bold text-ink-0">
        {{ t('settings.title') }}
      </h1>
      <p class="header-meta">
        Configure torrent client connection and download settings
      </p>
      <span class="bl" /><span class="br2" />
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
      <SettingsSection
        :title="t('settings.connection')"
        icon="i-heroicons-server-stack"
      >
        <ClientConfigForm
          v-model:client-type="clientType"
          v-model:url="clientUrl"
          v-model:username="clientUsername"
          v-model:password="clientPassword"
          v-model:host="clientHost"
          v-model:port="clientPort"
        />

        <div class="flex gap-2 pt-2">
          <UButtonBracket
            variant="bracket"
            :loading="isTesting"
            @click="handleTestConnection"
          >
            {{ t('settings.testConnection') }}
          </UButtonBracket>
        </div>
      </SettingsSection>

      <SettingsSection
        :title="t('settings.interface')"
        icon="i-heroicons-paint-brush"
      >
        <InterfaceSettings
          v-model:theme="theme"
          v-model:locale="currentLocale"
          v-model:items-per-page="itemsPerPage"
          :theme-options="themeOptions"
          :locale-options="localeOptions"
        />
      </SettingsSection>

      <SettingsSection
        :title="t('settings.downloads')"
        icon="i-heroicons-arrow-down-circle"
      >
        <DownloadSettings
          v-model:default-path="defaultPath"
          v-model:max-active="maxActive"
          v-model:download-limit="downloadLimit"
          v-model:upload-limit="uploadLimit"
        />
      </SettingsSection>

      <div class="flex justify-end">
        <UButtonBracket
          variant="bracket"
          :loading="isLoading"
          size="lg"
          @click="handleSaveSettings"
        >
          {{ t('settings.save') }}
        </UButtonBracket>
      </div>
    </div>
  </div>
</template>
