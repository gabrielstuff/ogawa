<script setup lang="ts">
interface Props {
  theme: string
  locale: string
  itemsPerPage: number
  themeOptions: Array<{ value: string, label: string }>
  localeOptions: Array<{ value: string, label: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:theme': [value: string]
  'update:locale': [value: string]
  'update:itemsPerPage': [value: number]
}>()

const { t } = useI18n()

const theme = computed({
  get: () => props.theme,
  set: val => emit('update:theme', val),
})

const locale = computed({
  get: () => props.locale,
  set: val => emit('update:locale', val),
})

const itemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: val => emit('update:itemsPerPage', val),
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.theme') }}</label>
      <USelectMenu
        v-model="theme"
        :items="themeOptions"
        value-key="value"
        color="neutral"
        variant="outline"
        class="w-full"
      />
    </div>

    <div>
      <label class="block text-sm font-bold mb-2 text-ink-3">{{ t('settings.language') }}</label>
      <USelectMenu
        v-model="locale"
        :items="localeOptions"
        value-key="value"
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
</template>
