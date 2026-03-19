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

<form class="capsule-form" on:submit|preventDefault={handleSubmit}>
  <div class="form-group">
    <label class="input-label" for="title">标题</label>
    <input
      id="title"
      bind:value={form.title}
      class="input {errors.title ? 'input-error' : ''}"
      placeholder="给时间胶囊取个名字"
      maxlength="100"
    />
    {#if errors.title}
      <p class="input-error-text">{errors.title}</p>
    {/if}
  </div>

  <div class="form-group">
    <label class="input-label" for="content">内容</label>
    <textarea
      id="content"
      bind:value={form.content}
      class="input {errors.content ? 'input-error' : ''}"
      placeholder="写下你想对未来说的话..."
      rows="5"
    ></textarea>
    {#if errors.content}
      <p class="input-error-text">{errors.content}</p>
    {/if}
  </div>

  <div class="form-row">
    <div class="form-group flex-1">
      <label class="input-label" for="creator">发布者</label>
      <input
        id="creator"
        bind:value={form.creator}
        class="input {errors.creator ? 'input-error' : ''}"
        placeholder="你的昵称"
        maxlength="30"
      />
      {#if errors.creator}
        <p class="input-error-text">{errors.creator}</p>
      {/if}
    </div>

    <div class="form-group flex-1">
      <label class="input-label" for="openAt">开启时间</label>
      <input
        id="openAt"
        type="datetime-local"
        bind:value={form.openAt}
        class="input {errors.openAt ? 'input-error' : ''}"
        min={minDateTime}
      />
      {#if errors.openAt}
        <p class="input-error-text">{errors.openAt}</p>
      {/if}
    </div>
  </div>

  <button type="submit" class="btn btn-primary btn-lg submit-btn" disabled={loading}>
    {loading ? '创建中...' : '封存时间胶囊'}
  </button>
</form>

<style>
  .capsule-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-row {
    display: flex;
    gap: var(--space-4);
  }

  .submit-btn {
    margin-top: var(--space-2);
    width: 100%;
  }

  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }
  }

  /* 暗色模式下反转日期选择器图标颜色 */
  :global([data-theme="dark"]) input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
</style>
