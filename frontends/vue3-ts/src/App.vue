<template>
  <AppHeader />
  <main>
    <router-view />
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped>
main {
  min-height: calc(100vh - var(--header-height) - 4rem);
}
</style>
