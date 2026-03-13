<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="text-sm text-secondary">
        <span>Powered By:</span>
        <span class="tech-stack">
          {{ techStack ? `Vue 3 | ${techStack.framework} | ${techStack.language} | ${techStack.database}` : '加载中...' }}
        </span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

const techStack = ref<TechStack | null>(null)

onMounted(() => {
  getHealthInfo()
    .then(res => { techStack.value = res.data.techStack })
    .catch(() => { techStack.value = null })
})
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
