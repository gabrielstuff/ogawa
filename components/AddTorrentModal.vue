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

const activeTab = ref<'file' | 'magnet' | 'url'>('file')
const magnetInput = ref('')
const urlInput = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')
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
    error.value = t('add.invalidFile')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('torrent', file)

    await $fetch('/api/torrents', {
      method: 'POST',
      body: formData,
    })

    success.value = t('add.torrentAddedSuccess')
    setTimeout(() => {
      isOpen.value = false
      emit('added')
      resetForm()
    }, 1500)
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || t('add.torrentAddFailed')
  }
  finally {
    isLoading.value = false
  }
}

async function addMagnet() {
  if (!magnetInput.value) {
    error.value = t('add.enterMagnet')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/torrents', {
      method: 'POST',
      body: {
        type: 'magnet',
        url: magnetInput.value,
      },
    })

    success.value = t('add.magnetAddSuccess')
    setTimeout(() => {
      isOpen.value = false
      emit('added')
      resetForm()
    }, 1500)
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || t('add.magnetAddFailed')
  }
  finally {
    isLoading.value = false
  }
}

async function addFromUrl() {
  if (!urlInput.value) {
    error.value = t('add.enterUrl')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/torrents', {
      method: 'POST',
      body: {
        type: 'url',
        url: urlInput.value,
      },
    })

    success.value = t('add.urlAddSuccess')
    setTimeout(() => {
      isOpen.value = false
      emit('added')
      resetForm()
    }, 1500)
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || t('add.urlAddFailed')
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
    error.value = t('add.clipboardFailed')
  })
}

function resetForm() {
  magnetInput.value = ''
  urlInput.value = ''
  activeTab.value = 'file'
  error.value = ''
  success.value = ''
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
        <UAlert
          v-if="success"
          color="success"
          :title="success"
          class="font-mono"
        />

        <UAlert
          v-if="error"
          color="error"
          :title="error"
          class="font-mono"
        />

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
