<template>
  <div class="page">
    <div class="container container-sm">
      <div class="page-header">
        <h1>开启时间胶囊</h1>
        <p>输入胶囊码，查看时间胶囊</p>
      </div>

      <CapsuleCodeInput
        v-model="code"
        :loading="loading"
        :error="error"
        @submit="handleQuery"
      />

      <div v-if="capsule" class="mt-8">
        <CapsuleCard :capsule="capsule" @expired="handleExpired" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCapsule } from '@/composables/useCapsule'
import CapsuleCodeInput from '@/components/CapsuleCodeInput.vue'
import CapsuleCard from '@/components/CapsuleCard.vue'

const route = useRoute()
const { capsule, loading, error, get } = useCapsule()
const code = ref('')

async function handleQuery(c: string) {
  await get(c)
}

async function handleExpired() {
  const currentCode = capsule.value?.code || code.value
  if (currentCode) await get(currentCode)
}

onMounted(() => {
  const routeCode = route.params.code as string
  if (routeCode) {
    code.value = routeCode
    handleQuery(routeCode)
  }
})
</script>
