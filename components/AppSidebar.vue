<script setup lang="ts">
interface NavItem {
  name: string
  path?: string
  icon: string
  action?: () => void
}

interface SettingsItem {
  name: string
  path: string
  icon: string
}

const props = defineProps<{
  items: NavItem[]
  settingsItem?: SettingsItem
  sidebarWidth?: number
}>()

const route = useRoute()
const addTorrentModal = useAddTorrentModal()

const sidebarStyle = computed(() => ({
  width: `${props.sidebarWidth || 56}px`,
}))

const handleAction = (item: NavItem) => {
  if (item.action === 'addTorrent') {
    addTorrentModal.value.show = true
  }
  else if (item.action) {
    item.action()
  }
}
</script>

<template>
  <aside
    class="fixed top-0 bottom-0 border-r border-line p-2 hidden md:flex flex-col bg-surface-h"
    :style="sidebarStyle"
  >
    <div class="flex items-center justify-center h-12 mb-4">
      <UIcon
        name="i-heroicons-cloud-arrow-down"
        class="w-6 h-6 text-accent"
      />
    </div>

    <nav class="flex-1 space-y-0">
      <template
        v-for="item in items"
        :key="item.path"
      >
        <NuxtLink
          v-if="!item.action"
          :to="item.path"
          class="flex flex-col items-center justify-center py-3 transition-colors"
          :class="route.path === item.path ? 'text-accent' : 'text-ink-3 hover:text-ink-1'"
        >
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
          />
          <span class="text-[9px] mt-1 font-semibold uppercase tracking-wider">{{ item.name.charAt(0) }}</span>
        </NuxtLink>
        <button
          v-else
          class="flex flex-col items-center justify-center py-3 transition-colors text-ink-3 hover:text-ink-1"
          @click="handleAction(item)"
        >
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
          />
          <span class="text-[9px] mt-1 font-semibold uppercase tracking-wider">{{ item.name.charAt(0) }}</span>
        </button>
      </template>
    </nav>

    <div class="mt-auto">
      <NuxtLink
        v-if="settingsItem"
        :to="settingsItem.path"
        class="flex flex-col items-center justify-center py-3 transition-colors"
        :class="route.path === settingsItem.path ? 'text-accent' : 'text-ink-3 hover:text-ink-1'"
      >
        <UIcon
          :name="settingsItem.icon"
          class="w-5 h-5"
        />
        <span class="text-[9px] mt-1 font-semibold uppercase tracking-wider">{{ settingsItem.name.charAt(0) }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>
