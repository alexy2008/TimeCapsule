<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let code = '';
  export let loading = false;
  export let error: string | null = null;

  const dispatch = createEventDispatcher<{ submit: string; codeChange: string }>();

  function handleSubmit() {
    if (code.trim().length === 8) {
      dispatch('submit', code.trim());
    }
  }

  function handleInput(value: string) {
    code = value;
    dispatch('codeChange', value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="code-input-group">
  <div class="search-container cyber-glass center-card">
    <p class="mb-6">输入8位提取码开启您的时间胶囊。</p>
    <div class="search-input-wrapper">
    <input
      type="text"
      value={code}
      class="cyber-input search-input mono-font text-center"
      placeholder="        "
      maxlength="8"
      on:input={(event) => handleInput((event.currentTarget as HTMLInputElement).value)}
      on:keydown={handleKeydown}
      autocomplete="off"
    />
      <div class="search-line-effect"></div>
    </div>
    {#if error}
      <p class="search-error">{error}</p>
    {/if}
    <div class="action-row mt-6">
      <button class="btn btn-primary" on:click={handleSubmit} disabled={loading || code.length !== 8}>
        {loading ? '查询中...' : '开启胶囊'}
      </button>
    </div>
  </div>
</div>

<style>
  .search-error {
    color: var(--magenta);
    margin-top: 1rem;
    text-align: center;
  }

  .search-container {
    max-width: 640px;
    margin: 0 auto;
  }
</style>
