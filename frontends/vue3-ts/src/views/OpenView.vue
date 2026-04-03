<template>
  <section id="view-search" class="view active">
    <div class="view-header">
      <button class="btn-back" @click="handleBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回
      </button>
      <h2>{{ capsule ? (capsule.opened ? '状态: 已解锁' : '状态: 锁定中') : '打开时间胶囊' }}</h2>
    </div>

    <CapsuleCodeInput
      v-if="!capsule"
      v-model="code"
      :loading="loading"
      :error="error"
      @submit="handleQuery"
    />

    <CapsuleCard v-else :capsule="capsule" @expired="handleExpired" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCapsule } from '@/composables/useCapsule'
import CapsuleCodeInput from '@/components/CapsuleCodeInput.vue'
import CapsuleCard from '@/components/CapsuleCard.vue'

const router = useRouter()
const route = useRoute()
const { capsule, loading, error, get, clear } = useCapsule()
const code = ref((route.params.code as string) || '')

function handleQuery(c: string) {
  router.push(`/open/${c}`)
}

async function handleExpired() {
  const currentCode = capsule.value?.code || code.value
  if (currentCode) await get(currentCode)
}

function handleBack() {
  if (capsule.value) {
    clear()
    router.push('/open')
  } else {
    router.push('/')
  }
}

watch(
  () => route.params.code,
  async (routeCode) => {
    if (typeof routeCode === 'string' && routeCode) {
      code.value = routeCode
      try {
        await get(routeCode)
      } catch {
        // handled in composable
      }
    } else {
      code.value = ''
      clear()
    }
  },
  { immediate: true },
)
</script>
