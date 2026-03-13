<template>
  <div class="page">
    <div class="container container-sm">
      <div class="page-header">
        <h1>创建时间胶囊</h1>
        <p>封存你的心意，在未来开启</p>
      </div>

      <div v-if="created" class="card success-card text-center">
        <div class="success-icon">&#10004;</div>
        <h2>胶囊创建成功！</h2>
        <p class="text-secondary mt-2">你的胶囊码是：</p>
        <p class="capsule-code">{{ created.code }}</p>
        <p class="text-sm text-secondary mt-2">请记住这个胶囊码，它是开启胶囊的唯一凭证</p>
        <div class="flex justify-center gap-3 mt-6">
          <button class="btn btn-secondary" @click="copyCode">{{ copied ? '已复制！' : '复制胶囊码' }}</button>
          <router-link :to="`/open/${created.code}`" class="btn btn-primary">查看胶囊</router-link>
        </div>
      </div>

      <template v-else>
        <div v-if="error" class="error-banner">{{ error }}</div>
        <CapsuleForm :loading="loading" @submit="handleSubmit" />
        <ConfirmDialog
          :visible="showConfirm"
          title="确认创建"
          :message="`确定要创建标题为「${pendingForm?.title}」的时间胶囊吗？`"
          @confirm="confirmCreate"
          @cancel="showConfirm = false"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Capsule, CreateCapsuleForm } from '@/types'
import { useCapsule } from '@/composables/useCapsule'
import CapsuleForm from '@/components/CapsuleForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { loading, error, create } = useCapsule()
const created = ref<Capsule | null>(null)
const showConfirm = ref(false)
const pendingForm = ref<CreateCapsuleForm | null>(null)
const copied = ref(false)

function handleSubmit(form: CreateCapsuleForm) {
  pendingForm.value = form
  showConfirm.value = true
}

async function confirmCreate() {
  showConfirm.value = false
  if (!pendingForm.value) return
  try {
    const result = await create(pendingForm.value)
    created.value = result
  } catch {
    // error handled in composable
  }
}

function copyCode() {
  if (created.value) {
    navigator.clipboard.writeText(created.value.code).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    })
  }
}
</script>

<style scoped>
.success-card {
  padding: var(--space-8);
}

.success-icon {
  font-size: 3rem;
  color: var(--color-success);
  margin-bottom: var(--space-4);
}

.capsule-code {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  letter-spacing: 0.2em;
  margin: var(--space-4) 0;
}

.error-banner {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  background-color: #fef2f2;
  color: var(--color-error);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

[data-theme="dark"] .error-banner {
  background-color: #450a0a;
  border-color: #7f1d1d;
}
</style>
