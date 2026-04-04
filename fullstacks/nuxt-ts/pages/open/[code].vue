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
import type { ApiResponse, Capsule } from '@/types'

const route = useRoute()
const routeCode = computed(() => String(route.params.code || ''))

useSeoMeta({
  title: `开启胶囊 ${routeCode.value} - 时间胶囊-Nuxt`,
  description: '查看指定胶囊码对应的时间胶囊状态',
})

const code = ref(routeCode.value)
const {
  data,
  pending: loading,
  error: fetchError,
  refresh,
} = await useAsyncData(
  () => `capsule-${routeCode.value}`,
  async () => {
    if (!routeCode.value) return null
    const response = await $fetch<ApiResponse<Capsule>>(`/api/v1/capsules/${routeCode.value}`)
    return response.data
  },
  {
    watch: [routeCode],
    server: true,
    lazy: false,
  },
)

const capsule = computed(() => data.value)
const error = computed(() => {
  if (!fetchError.value) return null
  const message = fetchError.value.message || '查询失败'
  return message.includes('[') ? '查询失败' : message
})

watch(routeCode, (value) => {
  code.value = value
}, { immediate: true })

function handleQuery(value: string) {
  navigateTo(`/open/${value}`)
}

async function handleExpired() {
  await refresh()
}

function handleBack() {
  if (capsule.value) {
    navigateTo('/open')
  } else {
    navigateTo('/')
  }
}
</script>
