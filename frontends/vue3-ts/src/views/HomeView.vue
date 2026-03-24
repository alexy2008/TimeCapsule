<template>
  <div class="page">
    <div class="container text-center">
      <div class="hero">
        <img src="@spec/assets/logo.svg" alt="时间胶囊" class="hero-logo" />
        <h1 class="hero-title">时间胶囊</h1>
        <p class="hero-subtitle text-secondary">
          封存此刻的心意，在未来的某个时刻开启
        </p>
        <div class="hero-actions">
          <router-link to="/create" class="action-btn">
            <span class="action-btn-create">
              <span class="action-main">
                <span class="action-icon">&#9998;</span>
                <span class="action-label">创建胶囊</span>
              </span>
              <span class="action-desc">封存此刻的心意</span>
            </span>
          </router-link>
          <router-link to="/open" class="action-btn">
            <span class="action-btn-open">
              <span class="action-main">
                <span class="action-icon">&#128275;</span>
                <span class="action-label">开启胶囊</span>
              </span>
              <span class="action-desc">取出未来的惊喜</span>
            </span>
          </router-link>
        </div>
      </div>

      <div class="features mt-16">
        <div class="grid grid-cols-3 gap-6">
          <div class="card text-center">
            <img :src="frontendLogoUrl" alt="前端技术栈" class="tech-logo" />
            <h3>前端</h3>
            <p class="text-sm text-secondary mt-2">Vue 3 + TypeScript</p>
          </div>
          <div class="card text-center">
            <img :src="backendLogoUrl" alt="后端技术栈" class="tech-logo" />
            <h3>后端</h3>
            <p class="text-sm text-secondary mt-2">{{ backendDescription }}</p>
          </div>
          <div class="card text-center">
            <img :src="databaseLogoUrl" alt="数据库技术栈" class="tech-logo" />
            <h3>数据库</h3>
            <p class="text-sm text-secondary mt-2">{{ databaseDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTechStack } from '@/composables/useTechStack'

const { techStack, loading, error } = useTechStack()
const frontendLogoUrl = '/frontend.svg'
const backendLogoUrl = '/tech-logos/backend.svg'
const databaseLogoUrl = '/tech-logos/database.svg'

const backendDescription = computed(() => {
  if (loading.value) {
    return '加载中...'
  }

  if (error.value || !techStack.value) {
    return '技术栈信息暂不可用'
  }

  return `${techStack.value.framework} · ${techStack.value.language}`
})

const databaseDescription = computed(() => {
  if (loading.value) {
    return '加载中...'
  }

  if (error.value || !techStack.value) {
    return '技术栈信息暂不可用'
  }

  return techStack.value.database
})
</script>

<style scoped>
.hero {
  padding: var(--space-16) 0 var(--space-8);
}

.hero-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
}

.hero-subtitle {
  font-size: var(--text-xl);
  margin-bottom: var(--space-8);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-5);
}

.action-btn {
  display: block;
  text-decoration: none;
}

.action-btn-create,
.action-btn-open {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-xl);
  color: #ffffff;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), filter var(--transition-fast);
  box-shadow: var(--shadow-md);
  min-width: 200px;
}

.action-main {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.action-btn-create {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
}

.action-btn-open {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.action-btn-create:hover,
.action-btn-open:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  filter: brightness(1.08);
}

.action-icon {
  font-size: 2rem;
  line-height: 1;
}

.action-label {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  letter-spacing: 0.02em;
}

.action-desc {
  font-size: var(--text-sm);
  opacity: 0.85;
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 280px;
  }
}

.tech-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  object-fit: contain;
}
</style>

<style>
/* 暗色模式：降低背景亮度，增强光晕边界 */
[data-theme="dark"] .action-btn-create {
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
  box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.25), var(--shadow-md);
}

[data-theme="dark"] .action-btn-open {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.25), var(--shadow-md);
}

[data-theme="dark"] .action-btn-create:hover,
[data-theme="dark"] .action-btn-open:hover {
  filter: brightness(1.15);
}
</style>
