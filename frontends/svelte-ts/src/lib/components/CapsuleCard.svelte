<script lang="ts">
  import type { Capsule } from '../types';
  import CountdownClock from './CountdownClock.svelte';
  import { createEventDispatcher } from 'svelte';

  export let capsule: Capsule;
  const dispatch = createEventDispatcher<{ expired: void }>();

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function handleExpired() {
    dispatch('expired');
  }
</script>

<div class="card capsule-card">
  <div class="card-header flex items-center justify-between">
    <h3 class="card-title">{capsule.title}</h3>
    <span class="badge {capsule.opened ? 'badge-success' : 'badge-warning'}">
      {capsule.opened ? '已开启' : '未到时间'}
    </span>
  </div>

  <div class="capsule-meta text-sm text-secondary">
    <span>发布者: {capsule.creator}</span>
    <span>胶囊码: {capsule.code}</span>
  </div>

  <div class="capsule-times text-sm text-secondary">
    <span>创建于: {formatTime(capsule.createdAt)}</span>
    <span>开启于: {formatTime(capsule.openAt)}</span>
  </div>

  {#if capsule.opened && capsule.content}
    <div class="capsule-content">
      <p>{capsule.content}</p>
    </div>
  {:else if !capsule.opened}
    <div class="capsule-locked text-center">
      <p class="lock-icon">&#128274;</p>
      <p class="text-secondary">胶囊尚未到开启时间</p>
      <CountdownClock targetIso={capsule.openAt} on:expired={handleExpired} />
    </div>
  {/if}
</div>

<style>
  .capsule-card {
    max-width: 600px;
    margin: 0 auto;
  }

  .capsule-meta,
  .capsule-times {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .capsule-content {
    margin-top: var(--space-4);
    padding: var(--space-4);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    white-space: pre-wrap;
    line-height: var(--leading-relaxed);
  }

  .capsule-locked {
    margin-top: var(--space-4);
    padding: var(--space-6);
  }

  .lock-icon {
    font-size: 3rem;
    margin-bottom: var(--space-2);
  }
</style>
