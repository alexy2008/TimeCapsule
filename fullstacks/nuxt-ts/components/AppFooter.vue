<template>
  <footer class="app-footer">
    <div class="stack-info cyber-glass-sm mono-font footer-info">
      <span class="status-dot green"></span>
      <span class="footer-text">{{ `HelloTime · 时间胶囊 · ${summary}` }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const summary = ['Nuxt', 'TypeScript', 'SQLite'].join(' · ')
</script>

<style scoped>
.footer-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  padding: 0.6rem 1rem;
}

.footer-text {
  font-size: 0.85rem;
  opacity: 0.82;
}
</style>
