<script lang="ts">
  let { visible = false, title = '', message = '', onconfirm = () => {}, oncancel = () => {} }: {
    visible?: boolean;
    title?: string;
    message?: string;
    onconfirm?: () => void;
    oncancel?: () => void;
  } = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      oncancel();
    }
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div class="overlay" onclick={handleBackdropClick} role="dialog" tabindex="-1">
    <div class="dialog">
      <h3 class="dialog-title">{title}</h3>
      <p class="dialog-message text-secondary">{message}</p>
      <div class="dialog-actions flex justify-end gap-3">
        <button class="btn btn-secondary" onclick={oncancel}>取消</button>
        <button class="btn btn-primary" onclick={onconfirm}>确认</button>
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
