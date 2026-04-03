<template>
  <div v-if="capsule.opened && capsule.content" class="capsule-unlocked-card cyber-glass">
    <div class="locked-header">
      <span class="mono-font label">提取码: {{ capsule.code }}</span>
      <span class="badge badge-unlocked">已解锁</span>
    </div>

    <h1 class="capsule-title text-glow-cyan">{{ capsule.title }}</h1>

    <div class="meta-info border-bottom pb-4 mb-4">
      <span class="creator">创建者: <span class="mono-font">{{ capsule.creator }}</span></span>
      <div>
        <span class="created-at d-block">创建时间: <span class="mono-font">{{ formatTime(capsule.createdAt) }}</span></span>
        <span class="opened-at d-block mt-1 cyan-text">解锁时间: <span class="mono-font">{{ formatTime(capsule.openAt) }}</span></span>
      </div>
    </div>

    <div class="capsule-content-area">
      <div v-if="animating" class="decrypt-animation-overlay">
        <div class="scanner-beam"></div>
        <div class="binary-rain mono-font">01001010...</div>
      </div>
      <div class="content-text" :style="{ opacity: animating ? 0 : 1, transition: 'opacity 0.5s ease', whiteSpace: 'pre-wrap' }">
        {{ capsule.content }}
      </div>
    </div>
  </div>

  <div v-else class="capsule-locked-card cyber-glass">
    <div class="locked-header">
      <span class="mono-font label">提取码: {{ capsule.code }}</span>
      <span class="badge badge-locked pulse-danger">未到时间</span>
    </div>

    <h1 class="capsule-title">{{ capsule.title }}</h1>
    <div class="meta-info">
      <span class="creator">创建者: <span class="mono-font">{{ capsule.creator }}</span></span>
      <span class="created-at">创建时间: <span class="mono-font">{{ formatTime(capsule.createdAt) }}</span></span>
    </div>

    <CountdownClock :target-iso="capsule.openAt" @expired="emit('expired')" />

    <div class="data-encryption-visual mt-8">
      <div class="scramble-text mono-font" style="opacity: 0.7; margin-bottom: 0.5rem; font-size: 0.85rem">
        0x8F9A... 内容已被锁定 ...3B2C1
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="target-time mt-2" style="font-size: 0.85rem; color: var(--text-secondary)">
        解锁时间: <span class="mono-font text-glow">{{ formatTime(capsule.openAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Capsule } from '@/types'
import CountdownClock from './CountdownClock.vue'

const props = defineProps<{
  capsule: Capsule
}>()

const emit = defineEmits<{
  expired: []
}>()

const animating = ref(false)
let animationTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => [props.capsule.code, props.capsule.opened, props.capsule.content],
  ([, opened, content]) => {
    if (animationTimer) {
      clearTimeout(animationTimer)
      animationTimer = null
    }

    if (opened && content) {
      animating.value = true
      animationTimer = setTimeout(() => {
        animating.value = false
      }, 2500)
    } else {
      animating.value = false
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const progress = computed(() => {
  const created = new Date(props.capsule.createdAt).getTime()
  const open = new Date(props.capsule.openAt).getTime()
  const now = Date.now()
  return Math.max(0, Math.min(100, ((now - created) / (open - created)) * 100))
})
</script>
