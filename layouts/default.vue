<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { name: t('nav.torrents'), path: '/', icon: 'i-heroicons-arrow-down-circle' },
  { name: t('nav.add'), path: '/add', icon: 'i-heroicons-plus-circle' },
  { name: t('nav.feeds'), path: '/feeds', icon: 'i-heroicons-rss' },
  { name: t('nav.settings'), path: '/settings', icon: 'i-heroicons-cog-6-tooth' },
])

const localeOptions = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    value: l.code,
    label: l.name,
  })),
)

const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    setLocale(val)
  },
})

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
  <div class="min-h-screen min-h-[100dvh] bg-blue text-phosphor font-karla">
    <!-- Main Content -->
    <main class="pb-20 md:pb-16 md:ml-14">
      <!-- Mobile Language Switcher -->
      <div
        v-if="isMobile"
        class="p-2 flex justify-end"
      >
        <USelect
          v-model="currentLocale"
          :items="localeOptions"
          option-attribute="label"
          value-attribute="value"
          size="xs"
          color="neutral"
          variant="outline"
          class="w-28"
        />
      </div>
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      v-if="isMobile"
      class="fixed bottom-0 left-0 right-0 bg-deep/95 backdrop-blur-sm border-t border-scan/20 safe-area-inset-bottom z-50"
    >
      <div class="flex justify-around items-center h-16">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200"
          :class="route.path === item.path ? 'text-halation' : 'text-ghost hover:text-phosphor'"
        >
          <UIcon
            :name="item.icon"
            class="w-6 h-6"
          />
          <span class="text-[10px] mt-1 font-bold uppercase tracking-wide">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop Sidebar - Narrow navigation rail -->
    <aside
      v-if="!isMobile"
      class="fixed left-0 top-0 bottom-0 w-14 bg-deep border-r border-scan/20 p-2 hidden md:flex flex-col"
    >
      <div class="flex items-center justify-center h-12 mb-4">
        <UIcon
          name="i-heroicons-cloud-arrow-down"
          class="w-6 h-6 text-halation"
        />
      </div>

      <nav class="flex-1 space-y-0">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center py-3 transition-colors"
          :class="route.path === item.path ? 'text-halation' : 'text-ghost hover:text-phosphor'"
        >
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
          />
          <span class="text-[9px] mt-1 font-bold uppercase tracking-wider">{{ item.name.charAt(0) }}</span>
        </NuxtLink>
      </nav>

      <!-- Language Switcher -->
      <div class="mt-auto">
        <USelect
          v-model="currentLocale"
          :items="localeOptions"
          option-attribute="label"
          value-attribute="value"
          size="xs"
          color="neutral"
          variant="outline"
        />
      </div>
    </aside>

    <!-- Status Strip - Always visible -->
    <footer class="fixed bottom-0 left-0 right-0 md:left-14 status-strip z-40">
      <div class="flex items-center gap-2">
        <span class="status-dot"></span>
        <span>daemon: connected</span>
      </div>
      <span>feeds: 0</span>
      <span>watch: off</span>
      <span>disk: -- GB free</span>
      <span class="ml-auto">{{ appName }} v{{ appVersion }}</span>
    </footer>
  </div>
</template>
