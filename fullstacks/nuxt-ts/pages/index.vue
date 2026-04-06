<template>
  <section id="view-home" class="view active">
    <div class="hero-section">
      <div class="hero-badge">TIMECAPSULE SYSTEM</div>
      <h1 class="hero-title">封存此刻 <span class="text-glow">开启未来</span></h1>
      <p class="hero-subtitle">将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。</p>

      <div class="action-cards">
        <NuxtLink to="/create" class="action-card cyber-glass action-card-link" aria-label="创建胶囊">
          <div class="card-icon cyan-glow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <h3>创建胶囊</h3>
          <p>封存此刻寄语，投递给未来的自己</p>
        </NuxtLink>

        <NuxtLink to="/open" class="action-card cyber-glass action-card-link" aria-label="开启胶囊">
          <div class="card-icon magenta-glow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>开启胶囊</h3>
          <p>输入提取凭据，唤醒沉睡的时间印记</p>
        </NuxtLink>
      </div>

      <div class="tech-stack-simple cyber-glass">
        <h4 class="stack-title">TECHNOLOGY STACK</h4>
        <div class="tech-logos-grid text-center">
          <div v-for="item in techItems" :key="`${item.alt}-${item.label}`" class="tech-item" :title="item.label">
            <img :src="item.src" class="stack-icon" :alt="item.alt" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '首页 - 时间胶囊-Nuxt',
  description: '创建与开启时间胶囊的 Nuxt 全栈实现首页',
})

// 相比分离版前台，全栈架构下的组件具有感知系统栈的能力。
// 因为内置了 Nitro 服务端引擎，不再强依赖远端接口加载健康状态，而是统一在此静态声明。
const techItems = [
  { src: '/frontend.svg', alt: 'Nuxt Logo', label: 'Nuxt' },
  { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
  { src: '/sqlite-logo.svg', alt: 'SQLite Logo', label: 'SQLite' },
]
</script>

<style scoped>
.action-card-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.action-card-link:visited {
  color: inherit;
}
</style>
