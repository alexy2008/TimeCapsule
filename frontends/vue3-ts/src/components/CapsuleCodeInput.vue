<template>
  <div class="search-container cyber-glass center-card">
    <p class="mb-6">输入8位提取码开启您的时间胶囊。</p>
    <div class="search-input-wrapper">
      <input
        v-model="code"
        type="text"
        class="cyber-input search-input mono-font text-center"
        placeholder="        "
        maxlength="8"
        autocomplete="off"
        @keyup.enter="handleSubmit"
      />
      <div class="search-line-effect"></div>
    </div>
    <p v-if="error" class="search-error">{{ error }}</p>
    <div class="action-row mt-6">
      <button class="btn btn-primary" @click="handleSubmit" :disabled="loading || code.length !== 8">
        {{ loading ? '查询中...' : '开启胶囊' }}
      </button>
    </div>
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

watch(() => props.modelValue, (val) => {
  code.value = val
})

watch(code, (val) => {
  emit('update:modelValue', val)
})

function handleSubmit() {
  if (code.value.length === 8) {
    emit('submit', code.value)
  }
}
</script>

<style scoped>
.search-error {
  color: var(--magenta);
  margin-top: 1rem;
  text-align: center;
}
</style>
