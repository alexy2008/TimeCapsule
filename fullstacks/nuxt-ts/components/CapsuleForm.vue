<template>
  <form class="cyber-form cyber-glass capsule-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="capsule-title">标题</label>
      <input
        id="capsule-title"
        v-model="form.title"
        class="cyber-input"
        :class="{ error: errors.title }"
        placeholder="给时间胶囊取个名字"
        maxlength="100"
      />
      <p v-if="errors.title" class="input-error-text form-error">{{ errors.title }}</p>
    </div>

    <div class="form-group">
      <label for="capsule-content">内容</label>
      <textarea
        id="capsule-content"
        v-model="form.content"
        class="cyber-input textarea"
        :class="{ error: errors.content }"
        placeholder="写下你想对未来说的话..."
        rows="6"
      ></textarea>
      <p v-if="errors.content" class="input-error-text form-error">{{ errors.content }}</p>
    </div>

    <div class="meta-row">
      <div class="form-group">
        <label for="capsule-creator">发布者</label>
        <input
          id="capsule-creator"
          v-model="form.creator"
          class="cyber-input"
          :class="{ error: errors.creator }"
          placeholder="你的昵称"
          maxlength="30"
        />
        <p v-if="errors.creator" class="input-error-text form-error">{{ errors.creator }}</p>
      </div>

      <div class="form-group">
        <label for="capsule-open-at">开启时间</label>
        <input
          id="capsule-open-at"
          v-model="form.openAt"
          type="datetime-local"
          class="cyber-input"
          :class="{ error: errors.openAt }"
          :min="minDateTime"
        />
        <p v-if="errors.openAt" class="input-error-text form-error">{{ errors.openAt }}</p>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary btn-glow" :disabled="loading">
        <span class="btn-text">{{ loading ? '创建中...' : '封存胶囊' }}</span>
        <div class="btn-scanner"></div>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { CreateCapsuleForm } from '@/types'

const emit = defineEmits<{
  submit: [form: CreateCapsuleForm]
}>()

defineProps<{
  loading?: boolean
}>()

const form = reactive<CreateCapsuleForm>({
  title: '',
  content: '',
  creator: '',
  openAt: '',
})

const errors = reactive({
  title: '',
  content: '',
  creator: '',
  openAt: '',
})

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

function validate(): boolean {
  let valid = true
  errors.title = ''
  errors.content = ''
  errors.creator = ''
  errors.openAt = ''

  if (!form.title.trim()) {
    errors.title = '请输入标题'
    valid = false
  }
  if (!form.content.trim()) {
    errors.content = '请输入内容'
    valid = false
  }
  if (!form.creator.trim()) {
    errors.creator = '请输入发布者昵称'
    valid = false
  }
  if (!form.openAt) {
    errors.openAt = '请选择开启时间'
    valid = false
  } else if (new Date(form.openAt) <= new Date()) {
    errors.openAt = '开启时间必须在未来'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (validate()) {
    emit('submit', { ...form })
  }
}
</script>

<style scoped>
.capsule-form {
  display: flex;
  flex-direction: column;
}

.meta-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.meta-row .form-group {
  min-width: 0;
}

.meta-row .cyber-input {
  width: 100%;
  min-height: 3.5rem;
}

.meta-row input[type='datetime-local'] {
  min-height: 3.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.form-error {
  color: var(--magenta);
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

@media (max-width: 640px) {
  .meta-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>

<style>
[data-theme="dark"] .capsule-form input[type="datetime-local"] {
  color-scheme: dark;
}

[data-theme="light"] .capsule-form input[type="datetime-local"] {
  color-scheme: light;
}
</style>
