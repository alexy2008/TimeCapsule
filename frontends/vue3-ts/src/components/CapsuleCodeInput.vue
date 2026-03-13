<template>
  <div class="code-input-group">
    <div class="input-wrapper">
      <input
        v-model="code"
        class="input code-input"
        placeholder="输入 8 位胶囊码"
        maxlength="8"
        @keyup.enter="handleSubmit"
      />
      <button class="btn btn-primary" @click="handleSubmit" :disabled="loading || code.length !== 8">
        {{ loading ? '查询中...' : '开启' }}
      </button>
    </div>
    <p v-if="error" class="input-error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [code: string]
}>()

const code = ref(props.modelValue)

watch(() => props.modelValue, (val) => { code.value = val })
watch(code, (val) => { emit('update:modelValue', val) })

function handleSubmit() {
  if (code.value.length === 8) {
    emit('submit', code.value)
  }
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  gap: var(--space-2);
}

.code-input {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  flex: 1;
}
</style>
