<script lang="ts">
  import { link } from 'svelte-spa-router';

  let { to, class: className = '', 'aria-label': ariaLabel }: { to: string; class?: string; 'aria-label'?: string } = $props();
</script>

<a href={to} class={className} use:link aria-label={ariaLabel}>
  <slot></slot>
</a>
