<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>管理后台</h1>
      </div>

      <AdminLogin
        v-if="!isLoggedIn"
        :loading="loading"
        :error="error"
        @login="handleLogin"
      />

      <template v-else>
        <div class="admin-bar flex items-center justify-between mb-6">
          <p class="text-sm text-secondary">已登录为管理员</p>
          <button class="btn btn-secondary btn-sm" @click="logout">退出登录</button>
        </div>

        <CapsuleTable
          :capsules="capsules"
          :page-info="pageInfo"
          :loading="loading"
          @delete="handleDelete"
          @page="fetchCapsules"
          @refresh="() => fetchCapsules(pageInfo.number)"
        />

        <ConfirmDialog
          :visible="showDeleteConfirm"
          title="确认删除"
          :message="`确定要删除胶囊 ${deleteTarget} 吗？此操作不可恢复。`"
          @confirm="confirmDelete"
          @cancel="showDeleteConfirm = false"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdmin } from '@/composables/useAdmin'
import AdminLogin from '@/components/AdminLogin.vue'
import CapsuleTable from '@/components/CapsuleTable.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const {
  capsules,
  pageInfo,
  loading,
  error,
  isLoggedIn,
  login,
  logout,
  fetchCapsules,
  deleteCapsule,
} = useAdmin()

const showDeleteConfirm = ref(false)
const deleteTarget = ref('')

async function handleLogin(password: string) {
  try {
    await login(password)
    await fetchCapsules()
  } catch {
    // error handled in composable
  }
}

function handleDelete(code: string) {
  deleteTarget.value = code
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  showDeleteConfirm.value = false
  await deleteCapsule(deleteTarget.value)
}

onMounted(() => {
  if (isLoggedIn.value) {
    fetchCapsules()
  }
})
</script>
