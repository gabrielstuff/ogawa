<script setup lang="ts">
interface StatusOption {
  value: string
  label: string
}

interface Props {
  searchModelValue: string
  statusModelValue: string
  statusOptions: StatusOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchModelValue': [value: string]
  'update:statusModelValue': [value: string]
}>()

const { t } = useI18n()

const search = computed({
  get: () => props.searchModelValue,
  set: val => emit('update:searchModelValue', val),
})

const status = computed({
  get: () => props.statusModelValue,
  set: val => emit('update:statusModelValue', val),
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2">
    <div class="input-bracket flex-1">
      <UInput
        v-model="search"
        :placeholder="t('torrents.search')"
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="w-full"
      />
      <span class="bl" /><span class="br2" />
    </div>
    <USelect
      v-model="status"
      :options="statusOptions"
      option-attribute="label"
      value-attribute="value"
      size="sm"
      color="neutral"
      variant="outline"
      class="w-full sm:w-32"
    />
  </div>
</template>
