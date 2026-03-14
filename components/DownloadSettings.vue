<script setup lang="ts">
interface Props {
  defaultPath: string
  maxActive: number
  downloadLimit: number
  uploadLimit: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:defaultPath': [value: string]
  'update:maxActive': [value: number]
  'update:downloadLimit': [value: number]
  'update:uploadLimit': [value: number]
}>()

const { t } = useI18n()

const defaultPath = computed({
  get: () => props.defaultPath,
  set: val => emit('update:defaultPath', val),
})

const maxActive = computed({
  get: () => props.maxActive,
  set: val => emit('update:maxActive', val),
})

const downloadLimit = computed({
  get: () => props.downloadLimit,
  set: val => emit('update:downloadLimit', val),
})

const uploadLimit = computed({
  get: () => props.uploadLimit,
  set: val => emit('update:uploadLimit', val),
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.defaultDownloadPath') }}</label>
      <UInput
        v-model="defaultPath"
        placeholder="/downloads"
        color="neutral"
        variant="outline"
      />
    </div>

    <div>
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.maxActiveDownloads') }}</label>
      <UInput
        v-model="maxActive"
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
          v-model="downloadLimit"
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
          v-model="uploadLimit"
          type="number"
          min="0"
          :placeholder="t('settings.unlimited')"
          color="neutral"
          variant="outline"
        />
      </div>
    </div>
  </div>
</template>
