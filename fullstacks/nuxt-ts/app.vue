<template>
  <div>
    <!-- Nuxt 根组件承担应用壳职责，页面内容由 NuxtPage 注入。 -->
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
    // SSR 首屏就把主题写到 html 属性上，避免客户端接管前出现闪烁。
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
