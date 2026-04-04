<template>
  <section v-if="created" id="view-created" class="view active">
    <div class="success-container cyber-glass text-center">
      <div class="status-icon success-glow">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h2>胶囊创建成功</h2>
      <p>您的时间胶囊已成功封存。</p>
      <div class="capsule-key-box">
        <span class="label">胶囊码</span>
        <div class="code-display mono-font glow-text">{{ created.code }}</div>
        <button class="btn btn-icon btn-copy" @click="copyCode" aria-label="Copy code">
          <span v-if="copied">✓</span>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <div class="cyber-glass code-notice">
        <div class="mono-font notice-label">SAVE THIS CODE</div>
        <div class="code-notice-text">请务必妥善保存胶囊码。它是开启此胶囊的唯一凭证，丢失后将无法找回或补发。</div>
      </div>
      <button class="btn btn-outline mt-6" @click="router.push('/')">返回首页</button>
    </div>
  </section>

  <section v-else id="view-create" class="view active">
    <div class="view-header">
      <button class="btn-back" @click="router.push('/')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回
      </button>
      <h2>创建时间胶囊</h2>
    </div>

    <div v-if="error" class="create-error">{{ error }}</div>
    <CapsuleForm :loading="loading" @submit="handleSubmit" />
    <ConfirmDialog
      :visible="showConfirm"
      title="确认创建"
      :message="`确定要创建标题为「${pendingForm?.title}」的时间胶囊吗？\n\n胶囊一经创建，内容和开启时间将无法修改，也无法删除。`"
      @confirm="confirmCreate"
      @cancel="showConfirm = false"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Capsule, CreateCapsuleForm } from '@/types'
import { useCapsule } from '@/composables/useCapsule'
import CapsuleForm from '@/components/CapsuleForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
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
.create-error {
  color: var(--magenta);
  margin-bottom: 1rem;
  text-align: center;
}

.code-notice {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border-color: rgba(0, 240, 255, 0.28);
  background: rgba(0, 240, 255, 0.07);
  text-align: left;
}

.notice-label {
  color: var(--cyan);
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
}

.code-notice-text {
  color: var(--text-primary);
  line-height: 1.7;
}
</style>
