<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('add.title')} - Ogawa`),
})

const activeTab = ref('file')
const magnetInput = ref('')
const urlInput = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const isDropzoneSupported = ref(true)

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

    const response = await $fetch('/api/torrents', {
      method: 'POST',
      body: formData,
    })

    success.value = t('add.torrentAddedSuccess')
    setTimeout(() => {
      navigateTo('/')
    }, 1500)
  }
  catch (e: any) {
    error.value = e.message || t('add.torrentAddFailed')
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
      navigateTo('/')
    }, 1500)
  }
  catch (e: any) {
    error.value = e.message || t('add.magnetAddFailed')
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
      navigateTo('/')
    }, 1500)
  }
  catch (e: any) {
    error.value = e.message || t('add.urlAddFailed')
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
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">
      {{ t('add.title') }}
    </h1>

    <!-- Success Message -->
    <UAlert
      v-if="success"
      color="success"
      variant="solid"
      class="mb-4"
    >
      {{ success }}
    </UAlert>

    <!-- Error Message -->
    <UAlert
      v-if="error"
      color="error"
      variant="solid"
      class="mb-4"
    >
      {{ error }}
    </UAlert>

    <!-- Tabs -->
    <UTabs
      v-model="activeTab"
      class="mb-6"
    >
      <UTab value="file">
        <UIcon
          name="i-heroicons-document-arrow-up"
          class="w-5 h-5 mr-2"
        />
        {{ t('add.file') }}
      </UTab>
      <UTab value="magnet">
        <UIcon
          name="i-heroicons-link"
          class="w-5 h-5 mr-2"
        />
        {{ t('add.magnet') }}
      </UTab>
      <UTab value="url">
        <UIcon
          name="i-heroicons-globe-alt"
          class="w-5 h-5 mr-2"
        />
        {{ t('add.url') }}
      </UTab>
    </UTabs>

    <!-- File Upload -->
    <div
      v-if="activeTab === 'file'"
      class="space-y-4"
    >
      <div
        v-if="isDropzoneSupported"
        class="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
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
          class="w-12 h-12 mx-auto text-gray-500 mb-4"
        />
        <p class="text-gray-300 mb-2">
          {{ t('add.dragDrop') }}
        </p>
        <p class="text-gray-500 text-sm">
          {{ t('add.orClickToBrowse') }}
        </p>
      </div>

      <div
        v-else
        class="text-center py-8"
      >
        <UInput
          type="file"
          accept=".torrent"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Magnet Link -->
    <div
      v-if="activeTab === 'magnet'"
      class="space-y-4"
    >
      <UInput
        v-model="magnetInput"
        :placeholder="t('add.magnetPlaceholder')"
        size="lg"
      />

      <div class="flex gap-2">
        <UButton
          :loading="isLoading"
          :disabled="!magnetInput"
          @click="addMagnet"
        >
          {{ t('add.addMagnet') }}
        </UButton>
        <UButton
          variant="ghost"
          @click="pasteFromClipboard"
        >
          <UIcon
            name="i-heroicons-clipboard"
            class="w-5 h-5"
          />
        </UButton>
      </div>
    </div>

    <!-- URL -->
    <div
      v-if="activeTab === 'url'"
      class="space-y-4"
    >
      <UInput
        v-model="urlInput"
        :placeholder="t('add.urlPlaceholder')"
        size="lg"
      />

      <UButton
        :loading="isLoading"
        :disabled="!urlInput"
        @click="addFromUrl"
      >
        {{ t('add.addFromUrl') }}
      </UButton>
    </div>
  </div>
</template>
