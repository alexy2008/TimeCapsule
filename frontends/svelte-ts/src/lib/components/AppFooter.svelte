<script lang="ts">
  import { onMount } from 'svelte';
  import { getHealthInfo } from '../api';
  import type { TechStack } from '../types';

  let techStack: TechStack | null = null;

  onMount(async () => {
    try {
      const res = await getHealthInfo();
      techStack = res.data.techStack;
    } catch {
      techStack = null;
    }
  });
</script>

<footer class="footer">
  <div class="container footer-inner">
    <p class="text-sm text-secondary">
      <span>Powered By:</span>
      <span class="tech-stack">
        {#if techStack}
          Svelte 5 | {techStack.framework} | {techStack.language} | {techStack.database}
        {:else}
          加载中...
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
