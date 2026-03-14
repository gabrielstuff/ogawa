<script setup lang="ts">
const route = useRoute()

const navItems = [
  { name: 'Torrents', path: '/', icon: 'i-heroicons-arrow-down-circle' },
  { name: 'Add', path: '/add', icon: 'i-heroicons-plus-circle' },
  { name: 'Feeds', path: '/feeds', icon: 'i-heroicons-rss' },
  { name: 'Settings', path: '/settings', icon: 'i-heroicons-cog-6-tooth' },
]

const isMobile = ref(true)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] bg-gray-900 text-gray-100">
    <!-- Main Content -->
    <main class="pb-20 md:pb-4 md:ml-56">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      v-if="isMobile"
      class="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 safe-area-inset-bottom z-50"
    >
      <div class="flex justify-around items-center h-16">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200"
          :class="route.path === item.path ? 'text-primary-500' : 'text-gray-400 hover:text-gray-200'"
        >
          <UIcon :name="item.icon" class="w-6 h-6" />
          <span class="text-xs mt-1">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop Sidebar -->
    <aside
      v-if="!isMobile"
      class="fixed left-0 top-0 bottom-0 w-56 bg-gray-800 border-r border-gray-700 p-3 hidden md:block"
    >
      <div class="flex items-center gap-2 mb-6 px-2">
        <UIcon name="i-heroicons-cloud-arrow-down" class="w-6 h-6 text-primary-500" />
        <h1 class="text-lg font-semibold">Ogawa</h1>
      </div>
      
      <nav class="space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm"
          :class="route.path === item.path ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'"
        >
          <UIcon :name="item.icon" class="w-4 h-4" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>
