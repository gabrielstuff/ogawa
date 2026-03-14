<script setup lang="ts">
interface NavItem {
  name: string
  path?: string
  icon: string
  action?: () => void
}

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()
const addTorrentModal = useAddTorrentModal()

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
  <nav
    class="fixed bottom-0 left-0 right-0 bg-surface-h/95 backdrop-blur-sm border-t border-line safe-area-inset-bottom z-50"
  >
    <div class="flex justify-around items-center h-16">
      <template
        v-for="item in items"
        :key="item.path"
      >
        <NuxtLink
          v-if="!item.action"
          :to="item.path"
          class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200"
          :class="route.path === item.path ? 'text-accent' : 'text-ink-3 hover:text-ink-1'"
        >
          <UIcon
            :name="item.icon"
            class="w-6 h-6"
          />
          <span class="text-[10px] mt-1 font-semibold uppercase tracking-wide">{{ $t(item.name) }}</span>
        </NuxtLink>
        <UButton
          v-else
          variant="ghost"
          class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200 text-ink-3 hover:text-ink-1 rounded-none"
          @click="handleAction(item)"
        >
          <UIcon
            :name="item.icon"
            class="w-6 h-6"
          />
          <span class="text-[10px] mt-1 font-semibold uppercase tracking-wide">{{ $t(item.name) }}</span>
        </UButton>
      </template>
    </div>
  </nav>
</template>
