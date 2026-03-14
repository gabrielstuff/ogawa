<script setup lang="ts">
const { navItems, settingsItem, sidebarWidth } = useLayout()

const appName = 'Ogawa'
const appVersion = '1.0.0'
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] bg-bg text-ink-1 font-karla">
    <!-- Main Content -->
    <main :class="$device.isMobile ? 'pb-20' : 'pb-16'" :style="$device.isDesktop ? { marginLeft: `${sidebarWidth}px` } : {}">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <AppBottomNav
      v-if="$device.isMobile"
      :items="navItems"
    />

    <!-- Desktop Sidebar -->
    <AppSidebar
      v-else
      :items="navItems"
      :settings-item="settingsItem"
      :sidebar-width="sidebarWidth"
    />

    <!-- Status Strip -->
    <footer 
      class="fixed bottom-0 z-40 status-strip"
      :style="$device.isMobile ? {} : { left: `${sidebarWidth}px` }"
    >
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
