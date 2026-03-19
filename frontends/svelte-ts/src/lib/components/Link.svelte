<script lang="ts">
  import { link } from 'svelte-spa-router';
  export let to: string;
  let className: string = '';
  export { className as class };
</script>

<a href={to} class={className} use:link>
  <slot></slot>
</a>
