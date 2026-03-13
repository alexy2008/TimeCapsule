<template>
  <form class="capsule-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="input-label" for="title">标题</label>
      <input
        id="title"
        v-model="form.title"
        class="input"
        :class="{ 'input-error': errors.title }"
        placeholder="给时间胶囊取个名字"
        maxlength="100"
      />
      <p v-if="errors.title" class="input-error-text">{{ errors.title }}</p>
    </div>

    <div class="form-group">
      <label class="input-label" for="content">内容</label>
      <textarea
        id="content"
        v-model="form.content"
        class="input"
        :class="{ 'input-error': errors.content }"
        placeholder="写下你想对未来说的话..."
        rows="5"
      ></textarea>
      <p v-if="errors.content" class="input-error-text">{{ errors.content }}</p>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label class="input-label" for="creator">发布者</label>
        <input
          id="creator"
          v-model="form.creator"
          class="input"
          :class="{ 'input-error': errors.creator }"
          placeholder="你的昵称"
          maxlength="30"
        />
        <p v-if="errors.creator" class="input-error-text">{{ errors.creator }}</p>
      </div>

      <div class="form-group flex-1">
        <label class="input-label" for="openAt">开启时间</label>
        <input
          id="openAt"
          v-model="form.openAt"
          type="datetime-local"
          class="input"
          :class="{ 'input-error': errors.openAt }"
          :min="minDateTime"
        />
        <p v-if="errors.openAt" class="input-error-text">{{ errors.openAt }}</p>
      </div>
    </div>

    <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="loading">
      {{ loading ? '创建中...' : '封存时间胶囊' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
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
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: var(--space-4);
}

.submit-btn {
  margin-top: var(--space-2);
  width: 100%;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>

<style>
/* 暗色模式下反转日期选择器图标颜色 */
[data-theme="dark"] .capsule-form input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>