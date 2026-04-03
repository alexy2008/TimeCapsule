<script lang="ts">
  import { onMount } from 'svelte';
  import { adminState, clearAdminSession, deleteAdminCapsuleByCode, fetchAdminCapsules, loginAdmin } from '../lib/admin-state.svelte';
  import AdminLogin from '../lib/components/AdminLogin.svelte';
  import CapsuleTable from '../lib/components/CapsuleTable.svelte';
  import ConfirmDialog from '../lib/components/ConfirmDialog.svelte';

  let showDeleteConfirm = false;
  let deleteTarget = '';

  async function handleLogin(event: CustomEvent<string>) {
    try {
      await loginAdmin(event.detail);
    } catch {
      // error state handled in shared admin state
    }
  }

  function logout() {
    clearAdminSession();
  }

  function handleDelete(event: CustomEvent<string>) {
    deleteTarget = event.detail;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    showDeleteConfirm = false;
    await deleteAdminCapsuleByCode(deleteTarget);
  }

  onMount(() => {
    if (adminState.token) {
      fetchAdminCapsules(0);
    }
  });

  function handlePage(event: CustomEvent<number>) {
    fetchAdminCapsules(event.detail);
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>管理后台</h1>
    </div>

    {#if !adminState.token}
      <AdminLogin
        loading={adminState.loading}
        error={adminState.error}
        on:login={handleLogin}
      />
    {:else}
      <div class="admin-bar flex items-center justify-between mb-6">
        <p class="text-sm text-secondary">已登录为管理员</p>
        <button class="btn btn-secondary btn-sm" on:click={logout}>退出登录</button>
      </div>

      <CapsuleTable
        capsules={adminState.capsules}
        pageInfo={adminState.pageInfo}
        loading={adminState.loading}
        on:delete={handleDelete}
        on:page={handlePage}
        on:refresh={() => fetchAdminCapsules(adminState.pageInfo.number)}
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
