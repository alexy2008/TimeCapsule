<script lang="ts">
  import { onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';
  import CapsuleCodeInput from '../lib/components/CapsuleCodeInput.svelte';
  import CapsuleCard from '../lib/components/CapsuleCard.svelte';
  import {
    clearOpenResult,
    openCapsuleByCode,
    openState,
    resetOpenState,
    setOpenCode,
  } from '../lib/open-state.svelte';

  let { params = {} }: { params?: { code?: string } } = $props();

  async function handleQuery(code: string) {
    if (!code) return;
    push(`/open/${code}`);
  }

  async function handleExpired() {
    const currentCode = openState.capsule?.code || openState.code;
    if (currentCode) {
      await openCapsuleByCode(currentCode, true);
    }
  }

  $effect(() => {
    if (params.code) {
      setOpenCode(params.code);
    } else {
      resetOpenState();
    }
  });

  $effect(() => {
    if (params.code) {
      void openCapsuleByCode(params.code);
    }
  });

  function handleBack() {
    if (openState.capsule) {
      clearOpenResult();
      push('/open');
    } else {
      push('/');
    }
  }

  onDestroy(() => {
    resetOpenState();
  });
</script>

<section id="view-search" class="view active">
  <div class="view-header">
    <button class="btn-back" onclick={handleBack}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      返回
    </button>
    <h2>{openState.capsule ? (openState.capsule.opened ? '状态: 已解锁' : '状态: 锁定中') : '打开时间胶囊'}</h2>
  </div>

  {#if !openState.capsule}
    <CapsuleCodeInput
      code={openState.code}
      loading={openState.loading}
      error={openState.error}
      oncodeChange={(value: string) => setOpenCode(value)}
      onsubmit={handleQuery}
    />
  {:else}
    <CapsuleCard capsule={openState.capsule} onexpired={handleExpired} />
  {/if}
</section>
