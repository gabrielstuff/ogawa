<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const addTorrentModal = useAddTorrentModal()

const navItems = computed(() => [
  { name: t('nav.torrents'), path: '/', icon: 'i-heroicons-arrow-down-circle' },
  { name: t('nav.add'), icon: 'i-heroicons-plus-circle', action: () => addTorrentModal.value.show = true },
  { name: t('nav.feeds'), path: '/feeds', icon: 'i-heroicons-rss' },
])

const settingsItem = { name: t('nav.settings'), path: '/settings', icon: 'i-heroicons-cog-6-tooth' }

const isMobile = ref(true)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const appName = 'Ogawa'
const appVersion = '1.0.0'
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] bg-bg text-ink-1 font-karla">
    <!-- Main Content -->
    <main class="pb-20 md:pb-16 md:ml-14">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      v-if="isMobile"
      class="fixed bottom-0 left-0 right-0 bg-surface-h/95 backdrop-blur-sm border-t border-line safe-area-inset-bottom z-50"
    >
      <div class="flex justify-around items-center h-16">
        <template
          v-for="item in navItems"
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
            <span class="text-[10px] mt-1 font-semibold uppercase tracking-wide">{{ item.name }}</span>
          </NuxtLink>
          <button
            v-else
            class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200 text-ink-3 hover:text-ink-1"
            @click="item.action"
          >
            <UIcon
              :name="item.icon"
              class="w-6 h-6"
            />
            <span class="text-[10px] mt-1 font-semibold uppercase tracking-wide">{{ item.name }}</span>
          </button>
        </template>
      </div>
    </nav>

    <!-- Desktop Sidebar - Narrow navigation rail -->
    <aside
      v-if="!isMobile"
      class="fixed left-0 top-0 bottom-0 w-14 bg-surface-h border-r border-line p-2 hidden md:flex flex-col"
    >
      <div class="flex items-center justify-center h-12 mb-4">
        <UIcon
          name="i-heroicons-cloud-arrow-down"
          class="w-6 h-6 text-accent"
        />
      </div>

      <nav class="flex-1 space-y-0">
        <template
          v-for="item in navItems"
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
            @click="item.action"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5"
            />
            <span class="text-[9px] mt-1 font-semibold uppercase tracking-wider">{{ item.name.charAt(0) }}</span>
          </button>
        </template>
      </nav>

      <!-- Settings - Sticky at bottom -->
      <div class="mt-auto">
        <NuxtLink
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

    <!-- Status Strip - Always visible -->
    <footer class="fixed bottom-0 left-0 right-0 md:left-14 status-strip z-40">
      <div class="flex items-center gap-2">
        <span class="status-dot" />
        <span>daemon: connected</span>
      </div>
      <span>feeds: 0</span>
      <span>watch: off</span>
      <span>disk: -- GB free</span>
      <span class="ml-auto">{{ appName }} v{{ appVersion }}</span>
    </footer>
  </div>
</template>
