<script lang="ts">
  import { onMount } from 'svelte';
  import { adminLogin, getAdminCapsules, deleteAdminCapsule } from '../lib/api';
  import type { Capsule, PageData } from '../lib/types';
  import AdminLogin from '../lib/components/AdminLogin.svelte';
  import CapsuleTable from '../lib/components/CapsuleTable.svelte';
  import ConfirmDialog from '../lib/components/ConfirmDialog.svelte';

  let capsules: Capsule[] = [];
  let pageInfo: Omit<PageData<Capsule>, 'content'> = {
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20
  };
  let loading = false;
  let error: string | null = null;
  
  let token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
  $: isLoggedIn = !!token;

  let showDeleteConfirm = false;
  let deleteTarget = '';

  async function fetchCapsules(page = 0) {
    if (!isLoggedIn) return;
    loading = true;
    error = null;
    try {
      const res = await getAdminCapsules(token!, page, 20);
      if (res.success) {
        capsules = res.data.content;
        const { content, ...rest } = res.data;
        pageInfo = rest;
      } else {
        error = res.message || '获取列表失败';
        if (res.errorCode === 'UNAUTHORIZED') {
          logout();
        }
      }
    } catch (e: any) {
      error = e.message || '网络错误';
    } finally {
      loading = false;
    }
  }

  async function handleLogin(event: CustomEvent<string>) {
    const password = event.detail;
    loading = true;
    error = null;
    try {
      const res = await adminLogin(password);
      if (res.success && res.data.token) {
        token = res.data.token;
        sessionStorage.setItem('admin_token', token!);
        await fetchCapsules(0);
      } else {
        error = res.message || '登录失败';
      }
    } catch (e: any) {
      error = e.message || '网络错误';
    } finally {
      loading = false;
    }
  }

  function logout() {
    token = null;
    sessionStorage.removeItem('admin_token');
    capsules = [];
  }

  function handleDelete(event: CustomEvent<string>) {
    deleteTarget = event.detail;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    showDeleteConfirm = false;
    if (!deleteTarget) return;
    loading = true;
    try {
      const res = await deleteAdminCapsule(token!, deleteTarget);
      if (res.success) {
        await fetchCapsules(pageInfo.number);
      } else {
        error = res.message || '删除失败';
        if (res.errorCode === 'UNAUTHORIZED') logout();
      }
    } catch (e: any) {
      error = e.message || '网络错误';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    if (isLoggedIn) {
      fetchCapsules(0);
    }
  });

  function handlePage(event: CustomEvent<number>) {
    fetchCapsules(event.detail);
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>管理后台</h1>
    </div>

    {#if !isLoggedIn}
      <AdminLogin
        {loading}
        {error}
        on:login={handleLogin}
      />
    {:else}
      <div class="admin-bar flex items-center justify-between mb-6">
        <p class="text-sm text-secondary">已登录为管理员</p>
        <button class="btn btn-secondary btn-sm" on:click={logout}>退出登录</button>
      </div>

      <CapsuleTable
        {capsules}
        {pageInfo}
        {loading}
        on:delete={handleDelete}
        on:page={handlePage}
        on:refresh={() => fetchCapsules(pageInfo.number)}
      />

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="确认删除"
        message={`确定要删除胶囊 ${deleteTarget} 吗？此操作不可恢复。`}
        on:confirm={confirmDelete}
        on:cancel={() => showDeleteConfirm = false}
      />
    {/if}
  </div>
</div>
