<script setup lang="ts">
const { navItems, settingsItem, sidebarWidth } = useLayout()
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] bg-bg text-ink-1 font-karla">
    <!-- Mobile: sticky status topbar + bottom nav -->
    <template v-if="$device.isMobile">
      <AppTopBar />
      <main class="pt-[34px] pb-20">
        <slot />
      </main>
      <AppBottomNav :items="navItems" />
    </template>

    <!-- Desktop: sidebar + content + footer -->
    <template v-else>
      <AppSidebar
        :items="navItems"
        :settings-item="settingsItem"
        :sidebar-width="sidebarWidth"
      />
      <main class="pb-[34px]" :style="{ marginLeft: `${sidebarWidth}px` }">
        <slot />
      </main>
      <AppFooter :offset-left="sidebarWidth" />
    </template>
  </div>
</template>
