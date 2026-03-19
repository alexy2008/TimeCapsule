<script lang="ts">
  import ObjectLink from "@/lib/components/Link.svelte";
  const Link = ObjectLink;
  import type { Capsule, CreateCapsuleForm } from '../lib/types';
  import { createCapsule } from '../lib/api';
  import CapsuleForm from '../lib/components/CapsuleForm.svelte';
  import ConfirmDialog from '../lib/components/ConfirmDialog.svelte';

  let loading = false;
  let error: string | null = null;
  let created: Capsule | null = null;
  
  let showConfirm = false;
  let pendingForm: CreateCapsuleForm | null = null;
  let copied = false;

  function handleSubmit(event: CustomEvent<CreateCapsuleForm>) {
    pendingForm = event.detail;
    showConfirm = true;
  }

  async function confirmCreate() {
    showConfirm = false;
    if (!pendingForm) return;
    
    loading = true;
    error = null;
    try {
      const response = await createCapsule(pendingForm);
      if (response.success) {
        created = response.data;
      } else {
        error = response.message || '创建失败';
      }
    } catch (err: any) {
      error = err.message || '网络错误，请稍后再试';
    } finally {
      loading = false;
    }
  }

  function copyCode() {
    if (created) {
      navigator.clipboard.writeText(created.code).then(() => {
        copied = true;
        setTimeout(() => { copied = false; }, 2000);
      });
    }
  }
</script>

<div class="page">
  <div class="container container-sm">
    <div class="page-header">
      <h1>创建时间胶囊</h1>
      <p>封存你的心意，在未来开启</p>
    </div>

    {#if created}
      <div class="card success-card text-center">
        <div class="success-icon">&#10004;</div>
        <h2>胶囊创建成功！</h2>
        <p class="text-secondary mt-2">你的胶囊码是：</p>
        <p class="capsule-code">{created.code}</p>
        <p class="text-sm text-secondary mt-2">请记住这个胶囊码，它是开启胶囊的唯一凭证</p>
        <div class="flex justify-center gap-3 mt-6">
          <button class="btn btn-secondary" on:click={copyCode}>
            {copied ? '已复制！' : '复制胶囊码'}
          </button>
          <Link to={`/open/${created.code}`} class="btn btn-primary">查看胶囊</Link>
        </div>
      </div>
    {:else}
      {#if error}
        <div class="error-banner">{error}</div>
      {/if}
      <CapsuleForm {loading} on:submit={handleSubmit} />
      <ConfirmDialog
        visible={showConfirm}
        title="确认创建"
        message={`确定要创建标题为「${pendingForm?.title || ''}」的时间胶囊吗？`}
        on:confirm={confirmCreate}
        on:cancel={() => showConfirm = false}
      />
    {/if}
  </div>
</div>

<style>
  .success-card {
    padding: var(--space-8);
  }

  .success-icon {
    font-size: 3rem;
    color: var(--color-success);
    margin-bottom: var(--space-4);
  }

  .capsule-code {
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-primary);
    letter-spacing: 0.2em;
    margin: var(--space-4) 0;
  }

  .error-banner {
    padding: var(--space-3) var(--space-4);
    margin-bottom: var(--space-4);
    background-color: #fef2f2;
    color: var(--color-error);
    border: 1px solid #fecaca;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  :global([data-theme="dark"]) .error-banner {
    background-color: #450a0a;
    border-color: #7f1d1d;
  }
</style>
