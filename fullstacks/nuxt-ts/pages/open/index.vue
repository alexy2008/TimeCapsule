<template>
  <section id="view-search" class="view active">
    <div class="view-header">
      <button class="btn-back" @click="navigateTo('/')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回
      </button>
      <h2>打开时间胶囊</h2>
    </div>

    <CapsuleCodeInput v-model="code" :loading="loading" :error="error" @submit="handleQuery" />
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '开启胶囊 - 时间胶囊-Nuxt',
  description: '输入胶囊码并查看时间胶囊状态',
})

const { loading, error, clear } = useCapsule()
const code = ref('')

clear()

function handleQuery(value: string) {
  navigateTo(`/open/${value}`)
}
</script>
