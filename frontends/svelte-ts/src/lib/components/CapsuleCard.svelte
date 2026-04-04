<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Capsule } from '../types';
  import CountdownClock from './CountdownClock.svelte';
  import { createEventDispatcher } from 'svelte';

  export let capsule: Capsule;
  const dispatch = createEventDispatcher<{ expired: void }>();
  let animating = false;
  let animationTimer: ReturnType<typeof setTimeout> | null = null;

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

  $: {
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }

    if (capsule?.opened && capsule?.content) {
      animating = true;
      animationTimer = setTimeout(() => {
        animating = false;
      }, 2500);
    } else {
      animating = false;
    }
  }

  onDestroy(() => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }
  });

  $: progress = (() => {
    const created = new Date(capsule.createdAt).getTime();
    const open = new Date(capsule.openAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.min(100, ((now - created) / (open - created)) * 100));
  })();
</script>

{#if capsule.opened && capsule.content}
  <div class="capsule-unlocked-card cyber-glass">
    <div class="locked-header">
      <span class="mono-font label">胶囊码: {capsule.code}</span>
      <span class="badge badge-unlocked">已解锁</span>
    </div>

    <h1 class="capsule-title text-glow-cyan">{capsule.title}</h1>

    <div class="meta-info border-bottom pb-4 mb-4">
      <span class="creator">发布者: <span class="mono-font">{capsule.creator}</span></span>
      <div>
        <span class="created-at d-block">创建时间: <span class="mono-font">{formatTime(capsule.createdAt)}</span></span>
        <span class="opened-at d-block mt-1 cyan-text">开启时间: <span class="mono-font">{formatTime(capsule.openAt)}</span></span>
      </div>
    </div>

    <div class="capsule-content-area">
      {#if animating}
        <div class="decrypt-animation-overlay">
          <div class="scanner-beam"></div>
          <div class="binary-rain mono-font">01001010...</div>
        </div>
      {/if}
      <div class="content-text" style:opacity={animating ? 0 : 1} style:transition="opacity 0.5s ease" style:white-space="pre-wrap">
        {capsule.content}
      </div>
    </div>
  </div>
{:else}
  <div class="capsule-locked-card cyber-glass">
    <div class="locked-header">
      <span class="mono-font label">胶囊码: {capsule.code}</span>
      <span class="badge badge-locked pulse-danger">未到时间</span>
    </div>

    <h1 class="capsule-title">{capsule.title}</h1>
    <div class="meta-info">
      <span class="creator">发布者: <span class="mono-font">{capsule.creator}</span></span>
      <span class="created-at">创建时间: <span class="mono-font">{formatTime(capsule.createdAt)}</span></span>
    </div>

    <CountdownClock targetIso={capsule.openAt} on:expired={handleExpired} />

    <div class="data-encryption-visual mt-8">
      <div class="scramble-text mono-font" style="opacity: 0.7; margin-bottom: 0.5rem; font-size: 0.85rem">
        0x8F9A... 内容已被锁定 ...3B2C1
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style:width={`${progress}%`}></div>
      </div>
      <div class="target-time mt-2" style="font-size: 0.85rem; color: var(--text-secondary)">
        开启时间: <span class="mono-font text-glow">{formatTime(capsule.openAt)}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .capsule-unlocked-card,
  .capsule-locked-card {
    max-width: 860px;
    margin: 0 auto;
  }
</style>
