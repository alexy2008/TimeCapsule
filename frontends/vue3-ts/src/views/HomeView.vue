<template>
  <section id="view-home" class="view active">
    <div class="hero-section">
      <div class="hero-badge">TIMECAPSULE SYSTEM</div>
      <h1 class="hero-title">封存此刻 <span class="text-glow">开启未来</span></h1>
      <p class="hero-subtitle">将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。</p>

      <div class="action-cards">
        <router-link to="/create" class="action-card cyber-glass action-card-link" aria-label="创建胶囊">
          <div class="card-icon cyan-glow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <h3>创建胶囊</h3>
          <p>封存此刻寄语，投递给未来的自己</p>
        </router-link>

        <router-link to="/open" class="action-card cyber-glass action-card-link" aria-label="开启胶囊">
          <div class="card-icon magenta-glow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>开启胶囊</h3>
          <p>输入提取凭据，唤醒沉睡的时间印记</p>
        </router-link>
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
import { computed } from 'vue'
import { useTechStack } from '@/composables/useTechStack'
import { simplifyTechLabel } from '@/utils/techStack'

const { techStack, loading, error } = useTechStack()

const techItems = computed(() => {
  const currentTechStack = techStack.value
  const fallback = error.value || !currentTechStack

  return [
    { src: '/frontend.svg', alt: 'Vue Logo', label: 'Vue' },
    { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
    {
      src: '/tech-logos/backend.svg',
      alt: '后端框架 Logo',
      label: loading.value ? '...' : fallback ? '?' : simplifyTechLabel(currentTechStack!.framework),
    },
    {
      src: '/tech-logos/language.svg',
      alt: '后端语言 Logo',
      label: loading.value ? '加载中' : fallback ? '?' : simplifyTechLabel(currentTechStack!.language),
    },
    {
      src: '/tech-logos/database.svg',
      alt: '数据库 Logo',
      label: loading.value ? '...' : fallback ? '?' : simplifyTechLabel(currentTechStack!.database),
    },
  ]
})
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
