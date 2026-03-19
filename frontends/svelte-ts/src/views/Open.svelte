<script lang="ts">
  import { onMount } from 'svelte';
  import { getCapsule } from '../lib/api';
  import type { Capsule } from '../lib/types';
  import CapsuleCodeInput from '../lib/components/CapsuleCodeInput.svelte';
  import CapsuleCard from '../lib/components/CapsuleCard.svelte';

  // 路由参数：svelte-spa-router 会传入 params 对象
  export let params: { code?: string } = {};

  let code = '';
  let loading = false;
  let error: string | null = null;
  let capsule: Capsule | null = null;

  async function handleQuery(event?: CustomEvent<string> | string) {
    const queryCode = typeof event === 'string' ? event : event?.detail;
    if (!queryCode) return;
    
    loading = true;
    error = null;
    capsule = null;
    try {
      const response = await getCapsule(queryCode);
      if (response.success) {
        capsule = response.data;
      } else {
        error = response.message || '查询失败';
      }
    } catch (err: any) {
      error = err.message || '网络错误，请稍后再试';
    } finally {
      loading = false;
    }
  }

  async function handleExpired() {
    const currentCode = capsule?.code || code;
    if (currentCode) {
      await handleQuery(currentCode);
    }
  }

  onMount(() => {
    if (params.code) {
      code = params.code;
      handleQuery(params.code);
    }
  });
</script>

<div class="page">
  <div class="container container-sm">
    <div class="page-header">
      <h1>开启时间胶囊</h1>
      <p>输入胶囊码，查看时间胶囊</p>
    </div>

    <CapsuleCodeInput
      bind:code
      {loading}
      {error}
      on:submit={handleQuery}
    />

    {#if capsule}
      <div class="mt-8">
        <CapsuleCard {capsule} on:expired={handleExpired} />
      </div>
    {/if}
  </div>
</div>
