<template>
  <footer class="app-footer">
    <div class="stack-info cyber-glass-sm mono-font footer-info">
      <span class="status-dot green"></span>
      <span class="footer-text">{{ `HelloTime · 时间胶囊 · ${summary}` }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTechStack } from '@/composables/useTechStack'
import { simplifyTechLabel } from '@/utils/techStack'

const { techStack, loading, error } = useTechStack()

const summary = computed(() => {
  if (loading.value) {
    return '加载中...'
  }

  if (error.value || !techStack.value) {
    return '技术栈信息暂不可用'
  }

  return [
    'Vue',
    'TypeScript',
    simplifyTechLabel(techStack.value.framework),
    simplifyTechLabel(techStack.value.language),
    simplifyTechLabel(techStack.value.database),
  ].join(' · ')
})
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
