<script lang="ts">
  import { onMount } from 'svelte';
  import { loadTechStack, techStack, techStackLoading, techStackError } from '../tech-stack';

  onMount(async () => {
    await loadTechStack();
  });
</script>

<footer class="footer">
  <div class="container footer-inner">
    <p class="text-sm text-secondary">
      <span>Powered By:</span>
      <span class="tech-stack">
        {#if $techStackLoading}
          加载中...
        {:else if $techStackError || !$techStack}
          技术栈信息暂不可用
        {:else}
          Svelte 5 | {$techStack.framework} | {$techStack.language} | {$techStack.database}
        {/if}
      </span>
    </p>
  </div>
</footer>

<style>
  .footer {
    padding: var(--space-6) 0;
    border-top: 1px solid var(--color-border);
    transition: border-color var(--transition-base);
  }

  .footer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tech-stack {
    margin-left: var(--space-3);
    color: var(--color-text-tertiary);
  }
</style>
