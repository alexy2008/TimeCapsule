<template>
  <section id="view-about" class="view active">
    <div class="view-header">
      <button class="btn-back" @click="navigateTo('/')">
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
            <button type="button" class="tech-orb secret-trigger" aria-label="隐藏管理入口" @click="handleSecretClick">
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
            <h4>Nuxt 全栈路由</h4>
          </div>
          <p class="text-muted text-sm">通过 pages 文件路由和 Nitro server/api，在同一项目中实现页面渲染与 API 服务。</p>
        </div>
        <div class="cyber-glass p-6">
          <div class="feature-header mb-4">
            <div class="f-icon">🌗</div>
            <h4>SSR 数据直达</h4>
          </div>
          <p class="text-muted text-sm mt-3">利用 useAsyncData 让首页、关于页和页脚共享技术栈数据，服务端首屏即具备完整展示能力。</p>
        </div>
        <div class="cyber-glass p-6">
          <div class="feature-header mb-4">
            <div class="f-icon">⛓️</div>
            <h4>Nitro API 一体化</h4>
          </div>
          <p class="text-muted text-sm mt-3">胶囊内容锁定逻辑、管理员认证与 SQLite 数据访问全部由 Nuxt 内建服务端完成。</p>
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
import { ref } from 'vue'

useSeoMeta({
  title: '关于 - 时间胶囊-Nuxt',
  description: '了解 HelloTime Nuxt 全栈实现的技术结构与设计理念',
})

const clickCount = ref(0)
const techItems = [
  { src: '/frontend.svg', alt: 'Nuxt', title: 'Nuxt', version: 'Nuxt 3' },
  { src: '/frontend-language.svg', alt: 'TypeScript', title: 'TypeScript', version: 'TypeScript 5' },
  { src: '/sqlite-logo.svg', alt: 'SQLite', title: 'SQLite', version: 'SQLite' },
]

function handleSecretClick() {
  clickCount.value += 1
  if (clickCount.value >= 5) {
    clickCount.value = 0
    navigateTo('/admin')
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
