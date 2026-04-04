<template>
  <section id="view-about" class="view active">
    <div class="view-header">
      <button class="btn-back" @click="router.push('/')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回
      </button>
      <h2>关于时间胶囊 (HelloTime)</h2>
    </div>

    <div class="about-content-wrapper">
      <div class="cyber-glass p-8 mb-8">
        <div class="flex-row gap-8">
          <div class="about-hero-text">
            <h3 class="text-glow-cyan mb-4">跨越时空的技术演示</h3>
            <p class="text-secondary mb-6">
              HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 <strong class="cyan-text text-glow">RealWorld</strong>
              规范的实验性全栈项目。本项目旨在展示在相同的业务逻辑下，如何利用不同的现代化技术架构构建具有高度一致性、可维护性和交互体验的应用程序。
            </p>
            <p class="text-secondary">
              每一行代码都经过精心设计，以确保在高性能后端引擎与现代化前端框架之间实现完美的契合。
            </p>
          </div>
          <div class="about-hero-deco">
            <button
              type="button"
              class="tech-orb secret-trigger"
              aria-label="隐藏管理入口"
              @click="handleSecretClick"
            >
              <div class="orb-core"></div>
              <div class="orb-ring ring-1"></div>
              <div class="orb-ring ring-2"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="about-grid mb-8">
        <div class="cyber-glass p-6">
          <div class="feature-header mb-4">
            <div class="f-icon">🛸</div>
            <h4>统一 API 交互</h4>
          </div>
          <p class="text-muted text-sm">完全遵循 OpenAPI 3.0 标准。无论底层是 Java, Go 还是 Python，前端都只需对接一套标准的 REST 接口。</p>
        </div>
        <div class="cyber-glass p-6">
          <div class="feature-header mb-4">
            <div class="f-icon">🌗</div>
            <h4>设计系统同步</h4>
          </div>
          <p class="text-muted text-sm mt-3">利用 CSS Custom Properties 维护一套原子化的 Design Tokens。所有框架共享这套玻璃拟态的科技感视觉规范。</p>
        </div>
        <div class="cyber-glass p-6">
          <div class="feature-header mb-4">
            <div class="f-icon">⛓️</div>
            <h4>数据层透明隔离</h4>
          </div>
          <p class="text-muted text-sm mt-3">胶囊内容的锁定逻辑在服务端实现硬隔离，确保了数据的时间安全性。</p>
        </div>
      </div>

      <div class="cyber-glass p-8 mb-8">
        <h3 class="text-glow-cyan mb-6">核心驱动 (Core Technologies)</h3>
        <div class="tech-logos-grid about-tech-grid">
          <div v-for="item in techItems" :key="`${item.alt}-${item.version}`" class="tech-item about-tech-item">
            <img :src="item.src" class="stack-icon about-stack-icon" :alt="item.alt" />
            <div class="text-center">
              <div class="text-glow about-tech-title">{{ item.title }}</div>
              <div class="text-tertiary mono-font mt-2 about-tech-version">{{ item.version }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTechStack } from '@/composables/useTechStack'

const router = useRouter()
const clickCount = ref(0)
const { techStack, loading, error } = useTechStack()

const techItems = computed(() => [
  { src: '/frontend.svg', alt: 'Vue', title: 'Vue', version: 'Vue 3' },
  { src: '/frontend-language.svg', alt: 'TypeScript', title: 'TypeScript', version: 'TypeScript 5' },
  {
    src: techStack.value ? `/tech-logos/backend.svg?v=${encodeURIComponent(techStack.value.framework)}` : '/tech-logos/backend.svg',
    alt: '后端框架',
    title: loading.value ? '后端框架' : error.value || !techStack.value ? '暂不可用' : techStack.value.framework,
    version: loading.value ? '加载中...' : error.value || !techStack.value ? '技术栈信息暂不可用' : techStack.value.framework,
  },
  {
    src: techStack.value ? `/tech-logos/language.svg?v=${encodeURIComponent(techStack.value.language)}` : '/tech-logos/language.svg',
    alt: '后端语言',
    title: loading.value ? '后端语言' : error.value || !techStack.value ? '暂不可用' : techStack.value.language,
    version: loading.value ? '加载中...' : error.value || !techStack.value ? '技术栈信息暂不可用' : techStack.value.language,
  },
  {
    src: techStack.value ? `/tech-logos/database.svg?v=${encodeURIComponent(techStack.value.database)}` : '/tech-logos/database.svg',
    alt: '数据库',
    title: loading.value ? '数据库' : error.value || !techStack.value ? '暂不可用' : techStack.value.database,
    version: loading.value ? '加载中...' : error.value || !techStack.value ? '技术栈信息暂不可用' : techStack.value.database,
  },
])

function handleSecretClick() {
  clickCount.value++
  if (clickCount.value >= 5) {
    clickCount.value = 0
    router.push('/admin')
  }
}
</script>

<style scoped>
.secret-trigger {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
}

.about-tech-grid {
  align-items: flex-start;
  margin-top: 3rem;
}

.about-tech-item {
  flex-direction: column;
  gap: 1.5rem;
}

.about-stack-icon {
  width: 64px;
  height: 64px;
}

.about-tech-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.about-tech-version {
  font-size: 0.9rem;
}
</style>
