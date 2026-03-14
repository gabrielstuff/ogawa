<script setup lang="ts">
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'added': []
}>()

const { t } = useI18n()
const toast = useToast()

const activeTab = ref<'file' | 'magnet' | 'url'>('file')
const magnetInput = ref('')
const urlInput = ref('')
const isLoading = ref(false)
const isDropzoneSupported = ref(true)

const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) handleFileUpload(file)
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (file) handleFileUpload(file)
  }
}

async function handleFileUpload(file: File) {
  if (!file.name.endsWith('.torrent')) {
    toast.add({ title: t('add.invalidFile'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('torrent', file)

    await $fetch('/api/torrents', {
      method: 'POST',
      body: formData,
    })

    toast.add({ title: t('add.torrentAddedSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
    isOpen.value = false
    emit('added')
    resetForm()
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('add.torrentAddFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isLoading.value = false
  }
}

async function addMagnet() {
  if (!magnetInput.value) {
    toast.add({ title: t('add.enterMagnet'), color: 'warning', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/torrents', {
      method: 'POST',
      body: { type: 'magnet', url: magnetInput.value },
    })

    toast.add({ title: t('add.magnetAddSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
    isOpen.value = false
    emit('added')
    resetForm()
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('add.magnetAddFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isLoading.value = false
  }
}

async function addFromUrl() {
  if (!urlInput.value) {
    toast.add({ title: t('add.enterUrl'), color: 'warning', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/torrents', {
      method: 'POST',
      body: { type: 'url', url: urlInput.value },
    })

    toast.add({ title: t('add.urlAddSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
    isOpen.value = false
    emit('added')
    resetForm()
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({ title: err.message || t('add.urlAddFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    isLoading.value = false
  }
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then((text) => {
    if (text.startsWith('magnet:')) {
      magnetInput.value = text
      activeTab.value = 'magnet'
    }
    else {
      urlInput.value = text
      activeTab.value = 'url'
    }
  }).catch(() => {
    toast.add({ title: t('add.clipboardFailed'), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  })
}

function resetForm() {
  magnetInput.value = ''
  urlInput.value = ''
  activeTab.value = 'file'
}

watch(isOpen, (val) => {
  if (!val) {
    resetForm()
  }
})
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h2 class="text-lg font-bold text-ink-0">
          {{ t('add.title') }}
        </h2>
      </template>

      <div class="space-y-4">
        <UTabs v-model="activeTab">
          <UTab value="file">
            <UIcon
              name="i-heroicons-document-arrow-up"
              class="w-4 h-4 mr-2"
            />
            {{ t('add.file') }}
          </UTab>
          <UTab value="magnet">
            <UIcon
              name="i-heroicons-link"
              class="w-4 h-4 mr-2"
            />
            {{ t('add.magnet') }}
          </UTab>
          <UTab value="url">
            <UIcon
              name="i-heroicons-globe-alt"
              class="w-4 h-4 mr-2"
            />
            {{ t('add.url') }}
          </UTab>
        </UTabs>

        <div v-if="activeTab === 'file'">
          <div
            v-if="isDropzoneSupported"
            class="bracket p-6 text-center cursor-pointer transition-colors hover:bg-electric/10"
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <input
              type="file"
              accept=".torrent"
              class="hidden"
              @change="handleFileSelect"
            >
            <UIcon
              name="i-heroicons-cloud-arrow-up"
              class="w-10 h-10 mx-auto text-ink-3/50 mb-3"
            />
            <p class="text-ink-3 mb-1 font-bold">
              {{ t('add.dragDrop') }}
            </p>
            <p class="text-ink-3/50 text-sm font-mono">
              {{ t('add.orClickToBrowse') }}
            </p>
            <span class="bl" /><span class="br2" />
          </div>
        </div>

        <div
          v-if="activeTab === 'magnet'"
          class="space-y-3"
        >
          <div class="input-bracket">
            <UInput
              v-model="magnetInput"
              :placeholder="t('add.magnetPlaceholder')"
              size="lg"
              class="w-full"
            />
            <span class="bl" /><span class="br2" />
          </div>
          <div class="flex gap-2">
            <UButtonBracket
              variant="bracket"
              :loading="isLoading"
              :disabled="!magnetInput"
              @click="addMagnet"
            >
              Add magnet
            </UButtonBracket>
            <UButton
              class="btn-ghost"
              @click="pasteFromClipboard"
            >
              <UIcon
                name="i-heroicons-clipboard"
                class="w-4 h-4"
              />
            </UButton>
          </div>
        </div>

        <div
          v-if="activeTab === 'url'"
          class="space-y-3"
        >
          <div class="input-bracket">
            <UInput
              v-model="urlInput"
              :placeholder="t('add.urlPlaceholder')"
              size="lg"
              class="w-full"
            />
            <span class="bl" /><span class="br2" />
          </div>
          <UButtonBracket
            variant="bracket"
            :loading="isLoading"
            :disabled="!urlInput"
            @click="addFromUrl"
          >
            {{ t('add.addFromUrl') }}
          </UButtonBracket>
        </div>
      </div>
    </UCard>
  </UModal>
</template>
