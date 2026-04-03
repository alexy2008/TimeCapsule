<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Capsule, PageData } from '../types';

  export let capsules: Capsule[] = [];
  export let pageInfo: Omit<PageData<Capsule>, 'content'> = { totalElements: 0, totalPages: 0, number: 0, size: 0 };
  export let loading = false;

  const dispatch = createEventDispatcher<{ delete: string; page: number; refresh: void }>();

  let expandedCode: string | null = null;

  function toggleExpand(code: string) {
    expandedCode = expandedCode === code ? null : code;
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="capsule-table-wrapper">
  <div class="table-header flex items-center justify-between mb-4">
    <h3>胶囊列表 ({pageInfo.totalElements} 条)</h3>
    <button class="btn btn-secondary btn-sm" on:click={() => dispatch('refresh')}>刷新</button>
  </div>

  {#if loading}
    <div class="text-center py-8 text-secondary">加载中...</div>
  {:else if capsules.length === 0}
    <div class="text-center py-8 text-secondary">暂无胶囊</div>
  {:else}
    <table class="table">
      <thead>
        <tr>
          <th>胶囊码</th>
          <th>标题</th>
          <th>发布者</th>
          <th>开启时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {#each capsules as capsule (capsule.code)}
          <tr>
            <td class="code-cell">{capsule.code}</td>
            <td>{capsule.title}</td>
            <td>{capsule.creator}</td>
            <td>{formatTime(capsule.openAt)}</td>
            <td>
              <span class="badge {capsule.opened ? 'badge-success' : 'badge-warning'}">
                {capsule.opened ? '已开启' : '未开启'}
              </span>
            </td>
            <td class="actions-cell">
              <button
                class="btn btn-secondary btn-sm"
                on:click={() => toggleExpand(capsule.code)}
              >
                {expandedCode === capsule.code ? '收起' : '查看'}
              </button>
              <button class="btn btn-danger btn-sm" on:click={() => dispatch('delete', capsule.code)}>删除</button>
            </td>
          </tr>
          {#if expandedCode === capsule.code}
            <tr class="content-row">
              <td colspan="6">
                <div class="content-preview">
                  <p class="content-label">内容：</p>
                  <p class="content-text">{capsule.content}</p>
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}

  {#if pageInfo.totalPages > 1}
    <div class="pagination flex items-center justify-center gap-2 mt-4">
      <button
        class="btn btn-secondary btn-sm"
        disabled={pageInfo.number === 0}
        on:click={() => dispatch('page', pageInfo.number - 1)}
      >上一页</button>
      <span class="text-sm text-secondary">
        {pageInfo.number + 1} / {pageInfo.totalPages}
      </span>
      <button
        class="btn btn-secondary btn-sm"
        disabled={pageInfo.number >= pageInfo.totalPages - 1}
        on:click={() => dispatch('page', pageInfo.number + 1)}
      >下一页</button>
    </div>
  {/if}
</div>

<style>
  .capsule-table-wrapper {
    overflow-x: auto;
  }

  .code-cell {
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
  }

  .content-row td {
    background-color: rgba(0, 240, 255, 0.03);
    padding: 1rem;
  }

  .content-preview {
    max-width: 800px;
  }

  .content-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .content-text {
    white-space: pre-wrap;
    line-height: 1.7;
    color: var(--text-secondary);
  }
</style>
