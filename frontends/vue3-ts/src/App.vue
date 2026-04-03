<template>
  <div class="ambient-glow"></div>
  <div class="background-grid"></div>

  <div class="app-container">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="cyber-glass center-card text-center route-loading">页面加载中...</div>
          </template>
        </Suspense>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.route-loading {
  padding: 2rem;
}
</style>
