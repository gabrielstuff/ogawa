<script setup lang="ts">
interface Props {
  clientType: string
  url?: string
  username?: string
  password?: string
  host?: string
  port?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:clientType': [value: string]
  'update:url': [value: string]
  'update:username': [value: string]
  'update:password': [value: string]
  'update:host': [value: string]
  'update:port': [value: number]
}>()

const { t } = useI18n()

const clientType = computed({
  get: () => props.clientType,
  set: val => emit('update:clientType', val),
})

const url = computed({
  get: () => props.url || '',
  set: val => emit('update:url', val),
})

const username = computed({
  get: () => props.username || '',
  set: val => emit('update:username', val),
})

const password = computed({
  get: () => props.password || '',
  set: val => emit('update:password', val),
})

const host = computed({
  get: () => props.host || '',
  set: val => emit('update:host', val),
})

const port = computed({
  get: () => props.port || 58846,
  set: val => emit('update:port', val),
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
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.torrentClient') }}</label>
      <USelectMenu
        v-model="clientType"
        :items="clientOptions"
        value-key="value"
        color="neutral"
        variant="outline"
        class="w-full"
      />
    </div>

    <div
      v-if="showQBitFields"
      class="space-y-3"
    >
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.clientUrl', { client: 'qBittorrent' }) }}</label>
        <UInput
          v-model="url"
          placeholder="http://localhost:8080"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.username') }}</label>
        <UInput
          v-model="username"
          placeholder="admin"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          color="neutral"
          variant="outline"
        />
      </div>
    </div>

    <div
      v-if="showTransmissionFields"
      class="space-y-3"
    >
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.clientUrl', { client: 'Transmission' }) }}</label>
        <UInput
          v-model="url"
          placeholder="http://localhost:9091"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.username') }}</label>
        <UInput
          v-model="username"
          placeholder="admin"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          color="neutral"
          variant="outline"
        />
      </div>
    </div>

    <div v-if="showRTorrentFields">
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.scgiUrl') }}</label>
      <UInput
        v-model="url"
        placeholder="localhost:5000"
        color="neutral"
        variant="outline"
      />
    </div>

    <div
      v-if="showDelugeFields"
      class="space-y-3"
    >
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.host') }}</label>
        <UInput
          v-model="host"
          placeholder="localhost"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.port') }}</label>
        <UInput
          v-model="port"
          type="number"
          placeholder="58846"
          color="neutral"
          variant="outline"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.password') }}</label>
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          color="neutral"
          variant="outline"
        />
      </div>
    </div>
  </div>
</template>
