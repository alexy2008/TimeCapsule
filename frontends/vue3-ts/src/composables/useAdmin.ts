/**
 * 管理员 Composable。
 * Vue 版本把页面交互之外的管理员逻辑集中在这里，方便读者对照 React hook 和 Angular service。
 */
import { ref, computed } from 'vue'
import type { Capsule, PageData } from '@/types'
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '@/api'

/** 通过模块级 ref 共享管理员令牌，并在刷新页面后从 sessionStorage 恢复。 */
const token = ref<string | null>(
  typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_token') : null
)

export function useAdmin() {
  const capsules = ref<Capsule[]>([])
  const pageInfo = ref<Omit<PageData<Capsule>, 'content'>>({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** 是否已登录完全取决于本地是否持有管理员令牌。 */
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 登录成功后立即把 token 持久化到 sessionStorage，
   * 这样刷新页面后仍能继续访问管理列表，但关闭会话后会自动失效。
   */
  async function login(password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await apiLogin(password)
      token.value = res.data.token
      sessionStorage.setItem('admin_token', res.data.token)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** 登出时同时清理本地缓存状态，避免界面残留旧数据。 */
  function logout() {
    token.value = null
    sessionStorage.removeItem('admin_token')
    capsules.value = []
    pageInfo.value = {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    }
  }

  /** 分页加载管理员可见的胶囊列表。 */
  async function fetchCapsules(page = 0) {
    if (!token.value) return
    loading.value = true
    error.value = null
    try {
      const res = await getAdminCapsules(token.value, page)
      capsules.value = res.data.content
      pageInfo.value = {
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      }
    } catch (e: unknown) {
      // 如果后端判定会话失效，前端也要同步退回未登录状态。
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        logout()
      }
      error.value = e instanceof Error ? e.message : '查询失败'
    } finally {
      loading.value = false
    }
  }

  /** 删除后刷新当前页，保持管理台的浏览位置不跳变。 */
  async function deleteCapsule(code: string) {
    if (!token.value) return
    loading.value = true
    error.value = null
    try {
      await deleteAdminCapsule(token.value, code)
      await fetchCapsules(pageInfo.value.number)
    } catch (e: unknown) {
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        logout()
      }
      error.value = e instanceof Error ? e.message : '删除失败'
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    capsules,
    pageInfo,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    fetchCapsules,
    deleteCapsule,
  }
}
