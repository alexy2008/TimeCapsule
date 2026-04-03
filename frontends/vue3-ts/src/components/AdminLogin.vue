<template>
  <form class="login-form cyber-glass" @submit.prevent="handleLogin">
    <h2 class="text-center mb-4">管理员登录</h2>
    <div class="form-group">
      <label for="password">管理员密码</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="cyber-input text-center mono-font"
        placeholder="******"
        autocomplete="current-password"
      />
    </div>
    <p v-if="error" class="input-error-text">{{ error }}</p>
    <button type="submit" class="btn btn-primary submit-btn" :disabled="loading || !password">
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  login: [password: string]
}>()

const password = ref('')

function handleLogin() {
  if (password.value) {
    emit('login', password.value)
  }
}
</script>

<style scoped>
.login-form {
  max-width: 450px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.submit-btn {
  width: 100%;
  justify-content: center;
}
</style>
