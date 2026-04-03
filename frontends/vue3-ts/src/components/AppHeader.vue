<template>
  <header class="app-header">
    <router-link to="/" class="logo logo-link" aria-label="返回首页">
      <img src="/favicon.svg" alt="HelloTime" class="logo-img" />
      <span class="logo-text">HelloTime</span>
    </router-link>
    <div class="header-actions">
      <nav class="top-nav">
        <router-link to="/about" active-class="active">关于</router-link>
      </nav>
      <div class="theme-toggle-wrap">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped>
.logo-img {
  width: 28px;
  height: 28px;
  display: block;
}

.logo-text {
  color: inherit;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.header-actions {
  display: flex;
  align-items: center;
}

.theme-toggle-wrap {
  display: flex;
  align-items: center;
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
}
</style>
