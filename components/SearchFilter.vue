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

const currentStatusLabel = computed(() => {
  const opt = props.statusOptions.find(o => o.value === props.statusModelValue)
  return opt?.label ?? 'All'
})

function cycleStatus() {
  const idx = props.statusOptions.findIndex(o => o.value === props.statusModelValue)
  const next = props.statusOptions[(idx + 1) % props.statusOptions.length]
  if (next) emit('update:statusModelValue', next.value)
}
</script>

<template>
  <div class="flex gap-2">
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
    <button
      class="bracket px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink-3 hover:text-ink-0 whitespace-nowrap transition-colors min-w-[4rem]"
      @click="cycleStatus"
    >
      {{ currentStatusLabel }}
      <span class="bl" /><span class="br2" />
    </button>
    <button class="bracket px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink-3 whitespace-nowrap hidden sm:block">
      Sort: activity
      <span class="bl" /><span class="br2" />
    </button>
  </div>
</template>
