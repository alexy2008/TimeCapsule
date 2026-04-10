<script lang="ts">
  let { code = '', loading = false, error = null, onsubmit = () => {}, oncodeChange = () => {} }: {
    code?: string;
    loading?: boolean;
    error?: string | null;
    onsubmit?: (code: string) => void;
    oncodeChange?: (value: string) => void;
  } = $props();

  function handleSubmit() {
    if (code.trim().length === 8) {
      onsubmit(code.trim());
    }
  }

  function handleInput(value: string) {
    code = value;
    oncodeChange(value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="code-input-group">
  <div class="search-container cyber-glass center-card">
    <p class="mb-6">输入8位胶囊码开启您的时间胶囊。</p>
    <div class="search-input-wrapper">
    <input
      type="text"
      value={code}
      class="cyber-input search-input mono-font text-center"
      placeholder="        "
      maxlength="8"
      oninput={(event) => handleInput((event.currentTarget as HTMLInputElement).value)}
      onkeydown={handleKeydown}
      autocomplete="off"
    />
      <div class="search-line-effect"></div>
    </div>
    {#if error}
      <p class="search-error">{error}</p>
    {/if}
    <div class="action-row mt-6">
      <button class="btn btn-primary" onclick={handleSubmit} disabled={loading || code.length !== 8}>
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
