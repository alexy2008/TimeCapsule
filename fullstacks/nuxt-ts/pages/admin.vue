<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>管理后台</h1>
      </div>

      <AdminLogin v-if="!isLoggedIn" :loading="loading" :error="error" @login="handleLogin" />

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
definePageMeta({
  middleware: ['admin-session'],
})

useSeoMeta({
  title: '管理后台 - 时间胶囊-Nuxt',
  description: 'Nuxt 全栈实现的管理员登录与胶囊管理页面',
})

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
    await fetchCapsules(0)
  } catch {
    // composable handles error
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
</script>
