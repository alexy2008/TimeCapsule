<template>
  <button class="theme-toggle" @click="toggle" :title="theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'">
    <span v-if="theme === 'light'" class="icon">&#9790;</span>
    <span v-else class="icon">&#9728;</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-tertiary);
  transition: background-color var(--transition-fast);
}

.theme-toggle:hover {
  background-color: var(--color-border);
}

.icon {
  font-size: var(--text-lg);
}
</style>
