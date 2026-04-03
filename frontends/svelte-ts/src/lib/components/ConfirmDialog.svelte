<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let visible = false;
  export let title = '';
  export let message = '';

  const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      dispatch('cancel');
    }
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div class="overlay" on:click={handleBackdropClick} role="dialog" tabindex="-1">
    <div class="dialog">
      <h3 class="dialog-title">{title}</h3>
      <p class="dialog-message text-secondary">{message}</p>
      <div class="dialog-actions flex justify-end gap-3">
        <button class="btn btn-secondary" on:click={() => dispatch('cancel')}>取消</button>
        <button class="btn btn-primary" on:click={() => dispatch('confirm')}>确认</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .dialog-message {
    margin-bottom: 1.5rem;
    line-height: 1.7;
    white-space: pre-line;
  }
</style>
