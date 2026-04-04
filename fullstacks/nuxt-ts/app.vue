<template>
  <div>
    <div class="ambient-glow"></div>
    <div class="background-grid"></div>
    <div class="app-container">
      <AppHeader />
      <main class="app-main">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme } = useTheme()

useHead(() => ({
  htmlAttrs: {
    lang: 'zh-CN',
    'data-theme': theme.value,
  },
}))
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
