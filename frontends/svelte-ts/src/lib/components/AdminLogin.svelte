<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let loading = false;
  export let error: string | null = null;

  const dispatch = createEventDispatcher<{ login: string }>();

  let password = '';

  function handleLogin() {
    if (password) {
      dispatch('login', password);
    }
  }
</script>

<form class="login-form cyber-glass" on:submit|preventDefault={handleLogin}>
  <h2 class="text-center mb-4">管理员登录</h2>
  <div class="form-group">
    <label class="input-label" for="password">密码</label>
    <input
      id="password"
      bind:value={password}
      type="password"
      class="cyber-input"
      placeholder="输入管理员密码"
      autocomplete="current-password"
    />
  </div>
  {#if error}
    <p class="input-error-text">{error}</p>
  {/if}
  <button type="submit" class="btn btn-primary submit-btn" disabled={loading || !password}>
    {loading ? '登录中...' : '登录'}
  </button>
</form>

<style>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .submit-btn {
    width: 100%;
  }
</style>
