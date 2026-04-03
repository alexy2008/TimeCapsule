<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CreateCapsuleForm } from '../types';

  export let loading = false;
  const dispatch = createEventDispatcher<{ submit: CreateCapsuleForm }>();

  let form: CreateCapsuleForm = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  };

  let errors = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  };

  $: minDateTime = (() => {
    const now = new Date();
    // Offset standardizer for ISO string input matching local time input value format limits
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  })();

  function validate(): boolean {
    let valid = true;
    errors = { title: '', content: '', creator: '', openAt: '' };

    if (!form.title.trim()) {
      errors.title = '请输入标题';
      valid = false;
    }
    if (!form.content.trim()) {
      errors.content = '请输入内容';
      valid = false;
    }
    if (!form.creator.trim()) {
      errors.creator = '请输入发布者昵称';
      valid = false;
    }
    if (!form.openAt) {
      errors.openAt = '请选择开启时间';
      valid = false;
    } else if (new Date(form.openAt) <= new Date()) {
      errors.openAt = '开启时间必须在未来';
      valid = false;
    }
    return valid;
  }

  function handleSubmit() {
    if (validate()) {
      dispatch('submit', { ...form });
    }
  }
</script>

<form class="cyber-form cyber-glass capsule-form" on:submit|preventDefault={handleSubmit}>
  <div class="form-group">
    <label for="capsule-title">标题</label>
    <input
      id="capsule-title"
      bind:value={form.title}
      class="cyber-input {errors.title ? 'error' : ''}"
      placeholder="给时间胶囊取个名字"
      maxlength="100"
    />
    {#if errors.title}
      <p class="input-error-text form-error">{errors.title}</p>
    {/if}
  </div>

  <div class="form-group">
    <label for="capsule-open-at">开启时间</label>
    <input
      id="capsule-open-at"
      type="datetime-local"
      bind:value={form.openAt}
      class="cyber-input {errors.openAt ? 'error' : ''}"
      min={minDateTime}
    />
    <div class="helper-text">在这之前，任何人（包括您自己）都无法查看内容</div>
    {#if errors.openAt}
      <p class="input-error-text form-error">{errors.openAt}</p>
    {/if}
  </div>

  <div class="form-group">
    <label for="capsule-content">内容</label>
    <textarea
      id="capsule-content"
      bind:value={form.content}
      class="cyber-input textarea {errors.content ? 'error' : ''}"
      placeholder="写下你想对未来说的话..."
      rows="6"
    ></textarea>
    {#if errors.content}
      <p class="input-error-text form-error">{errors.content}</p>
    {/if}
  </div>

  <div class="form-group">
    <label for="capsule-creator">发布者</label>
    <input
      id="capsule-creator"
      bind:value={form.creator}
      class="cyber-input {errors.creator ? 'error' : ''}"
      placeholder="你的昵称"
      maxlength="30"
    />
    {#if errors.creator}
      <p class="input-error-text form-error">{errors.creator}</p>
    {/if}
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary btn-glow" disabled={loading}>
      <span class="btn-text">{loading ? '创建中...' : '封存胶囊'}</span>
      <div class="btn-scanner"></div>
    </button>
  </div>
</form>

<style>
  .capsule-form {
    display: flex;
    flex-direction: column;
  }

  .form-error {
    color: var(--magenta);
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }

  :global([data-theme="dark"]) .capsule-form input[type="datetime-local"] {
    color-scheme: dark;
  }

  :global([data-theme="light"]) .capsule-form input[type="datetime-local"] {
    color-scheme: light;
  }
</style>
