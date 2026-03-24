<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="text-sm text-secondary">
        <span>Powered By:</span>
        <span class="tech-stack">
          {{ loading ? '加载中...' : error || !techStack ? '技术栈信息暂不可用' : `Vue 3 | ${techStack.framework} | ${techStack.language} | ${techStack.database}` }}
        </span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useTechStack } from '@/composables/useTechStack'

const { techStack, loading, error } = useTechStack()
</script>

<style scoped>
.footer {
  padding: var(--space-6) 0;
  border-top: 1px solid var(--color-border);
  transition: border-color var(--transition-base);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tech-stack {
  margin-left: var(--space-3);
  color: var(--color-text-tertiary);
}
</style>
