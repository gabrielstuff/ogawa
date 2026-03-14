<script setup lang="ts">
useHead({
  title: 'Ogawa - Torrent Client',
})
</script>

<template>
  <UApp :toaster="{ position: 'bottom-right', duration: 4000 }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
