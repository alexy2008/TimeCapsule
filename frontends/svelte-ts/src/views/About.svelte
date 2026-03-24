<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { loadTechStack, techStack, techStackLoading, techStackError } from '../lib/tech-stack';

  let clickCount = 0;

  onMount(async () => {
    await loadTechStack();
  });

  function handleSecretClick() {
    clickCount++;
    if (clickCount >= 5) {
      clickCount = 0;
      push('/admin');
    }
  }
</script>

<div class="page">
  <div class="container container-sm">
    <div class="page-header">
      <h1>关于时间胶囊</h1>
      <p>一个技术展示项目</p>
    </div>

    <div class="card mb-6">
      <h3 class="mb-4">项目简介</h3>
      <p class="text-secondary">
        时间胶囊 (HelloTime) 是一个类似 RealWorld 的技术展示应用。
        通过统一的 API 规范和可复用的前端样式，展示不同前后端技术栈的组合能力。
      </p>
    </div>

    <div class="card mb-6">
      <h3 class="mb-4">当前技术栈</h3>
      <ul class="tech-list">
        <li><strong>前端:</strong> Svelte 5 + Vite</li>
        <li><strong>后端:</strong> {$techStackLoading ? '加载中...' : $techStack?.framework || '技术栈信息暂不可用'}</li>
        <li><strong>语言:</strong> {$techStackLoading ? '加载中...' : $techStack?.language || '技术栈信息暂不可用'}</li>
        <li><strong>数据库:</strong> {$techStackLoading ? '加载中...' : $techStack?.database || '技术栈信息暂不可用'}</li>
        <li><strong>样式:</strong> 共享 CSS Design Tokens</li>
      </ul>
      {#if $techStackError}
        <p class="text-sm text-secondary mt-4">当前无法获取服务端技术栈详情。</p>
      {/if}
    </div>

    <div class="card">
      <h3 class="mb-4">设计理念</h3>
      <ul class="tech-list">
        <li>统一的 REST API 规范 (OpenAPI 3.0)</li>
        <li>可复用的前端样式系统 (CSS 自定义属性)</li>
        <li>支持亮色/暗色主题</li>
        <li>前后端分离，可自由组合技术栈</li>
      </ul>
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <p class="text-center text-sm text-tertiary mt-8" on:click={handleSecretClick}>
      HelloTime v1.0.0
    </p>
  </div>
</div>

<style>
  .tech-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: 0;
    margin: 0;
  }

  .tech-list li {
    color: var(--color-text-secondary);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .tech-list li:last-child {
    border-bottom: none;
  }
</style>
