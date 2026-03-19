<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let code = '';
  export let loading = false;
  export let error: string | null = null;

  const dispatch = createEventDispatcher<{ submit: string }>();

  function handleSubmit() {
    if (code.trim().length === 8) {
      dispatch('submit', code.trim());
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="code-input-group">
  <div class="input-wrapper">
    <input
      type="text"
      bind:value={code}
      class="input code-input"
      placeholder="输入 8 位胶囊码"
      maxlength="8"
      on:keydown={handleKeydown}
    />
    <button class="btn btn-primary" on:click={handleSubmit} disabled={loading || code.trim().length !== 8}>
      {loading ? '查询中...' : '开启'}
    </button>
  </div>
  {#if error}
    <p class="input-error-text">{error}</p>
  {/if}
</div>

<style>
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
