<template>
  <header class="header">
    <div class="container flex items-center justify-between">
      <router-link to="/" class="logo">
        <img src="@spec/assets/logo.svg" alt="logo" class="logo-img" />
        <span class="logo-text">时间胶囊</span>
      </router-link>
      <nav class="nav flex items-center gap-4">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/create" class="nav-link">创建</router-link>
        <router-link to="/open" class="nav-link">开启</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped>
.header {
  height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color var(--transition-base), border-color var(--transition-base);
  /* 让 header 内容垂直居中 */
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--color-text);
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  padding: var(--space-1) var(--space-2);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

/* 移动端：隐藏 Logo 文字，只保留图标 */
@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
}
</style>
