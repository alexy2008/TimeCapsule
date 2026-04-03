<template>
  <div v-if="time.expired" class="text-center mt-6">
    <div style="font-size: 2rem">🎉</div>
    <span class="text-secondary mt-2 inline-block">时间已到，胶囊即将开启…</span>
  </div>

  <div v-else class="countdown-display">
    <div class="countdown-ring"></div>
    <div class="countdown-text">
      <template v-for="(unit, i) in units" :key="unit.label">
        <div class="time-block">
          <span :class="['mono-font', 'num', i === units.length - 1 ? 'glow-text' : '']">{{ pad(unit.value) }}</span>
          <span class="unit">{{ unit.label }}</span>
        </div>
        <span v-if="i < units.length - 1" class="colon">:</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  targetIso: string
}>()

const emit = defineEmits<{
  expired: []
}>()

const time = useCountdown(props.targetIso)

let expiredTimer: ReturnType<typeof setTimeout> | null = null

watch(() => time.value.expired, (val) => {
  if (val) {
    if (expiredTimer) {
      clearTimeout(expiredTimer)
    }
    expiredTimer = setTimeout(() => emit('expired'), 3000)
  }
})

onUnmounted(() => {
  if (expiredTimer) {
    clearTimeout(expiredTimer)
  }
})

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const units = computed(() => [
  { value: time.value.days, label: '天' },
  { value: time.value.hours, label: '时' },
  { value: time.value.minutes, label: '分' },
  { value: time.value.seconds, label: '秒' },
])
</script>
