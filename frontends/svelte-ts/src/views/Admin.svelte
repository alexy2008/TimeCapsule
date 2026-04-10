<script lang="ts">
  import { onMount } from 'svelte';
  import { adminState, clearAdminSession, deleteAdminCapsuleByCode, fetchAdminCapsules, loginAdmin } from '../lib/admin-state.svelte';
  import AdminLogin from '../lib/components/AdminLogin.svelte';
  import CapsuleTable from '../lib/components/CapsuleTable.svelte';
  import ConfirmDialog from '../lib/components/ConfirmDialog.svelte';

  let showDeleteConfirm = false;
  let deleteTarget = '';

  async function handleLogin(password: string) {
    try {
      await loginAdmin(password);
    } catch {
      // error state handled in shared admin state
    }
  }

  function logout() {
    clearAdminSession();
  }

  function handleDelete(code: string) {
    deleteTarget = code;
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

  function handlePage(page: number) {
    fetchAdminCapsules(page);
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
        onlogin={handleLogin}
      />
    {:else}
      <div class="admin-bar flex items-center justify-between mb-6">
        <p class="text-sm text-secondary">已登录为管理员</p>
        <button class="btn btn-secondary btn-sm" onclick={logout}>退出登录</button>
      </div>

      <CapsuleTable
        capsules={adminState.capsules}
        pageInfo={adminState.pageInfo}
        loading={adminState.loading}
        ondelete={handleDelete}
        onpage={handlePage}
        onrefresh={() => fetchAdminCapsules(adminState.pageInfo.number)}
      />

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="确认删除"
        message={`确定要删除胶囊 ${deleteTarget} 吗？此操作不可恢复。`}
        onconfirm={confirmDelete}
        oncancel={() => showDeleteConfirm = false}
      />
    {/if}
  </div>
</div>
