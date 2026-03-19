<script lang="ts">
  import { theme, toggleTheme } from "../theme";
</script>

<button
  class="theme-toggle"
  on:click={toggleTheme}
  title={$theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
>
  {#if $theme === 'light'}
    <span class="icon">&#9790;</span>
  {:else}
    <span class="icon">&#9728;</span>
  {/if}
</button>

<style>
  .theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-tertiary);
    transition: background-color var(--transition-fast);
    border: none;
    cursor: pointer;
  }

  .theme-toggle:hover {
    background-color: var(--color-border);
  }

  .icon {
    font-size: var(--text-lg);
  }
</style>
