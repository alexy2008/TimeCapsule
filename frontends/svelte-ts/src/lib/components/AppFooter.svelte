<script lang="ts">
  import { techStackState } from '../tech-stack-state.svelte';
  import { simplifyTechLabel } from '../tech-stack-utils';

</script>

<footer class="app-footer">
  <div class="stack-info cyber-glass-sm mono-font footer-info">
    <span class="status-dot green"></span>
    <span class="footer-text">
      HelloTime · 时间胶囊 ·
      {#if techStackState.loading}
        加载中...
      {:else if techStackState.error || !techStackState.techStack}
        技术栈信息暂不可用
      {:else}
        {[
          'Svelte',
          'TypeScript',
          simplifyTechLabel(techStackState.techStack.framework),
          simplifyTechLabel(techStackState.techStack.language),
          simplifyTechLabel(techStackState.techStack.database),
        ].join(' · ')}
      {/if}
    </span>
  </div>
</footer>

<style>
  .footer-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-align: center;
    padding: 0.6rem 1rem;
  }

  .footer-text {
    font-size: 0.85rem;
    opacity: 0.82;
  }
</style>
