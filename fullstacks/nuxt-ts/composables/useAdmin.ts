import { computed } from 'vue'
import type { Capsule, PageData } from '@/types'
import { adminLogin as apiLogin, deleteAdminCapsule, getAdminCapsules } from '@/utils/api'

export function useAdmin() {
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    default: () => null,
  })
  const capsules = useState<Capsule[]>('admin-capsules', () => [])
  const pageInfo = useState<Omit<PageData<Capsule>, 'content'>>('admin-page-info', () => ({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  }))
  const loading = useState<boolean>('admin-loading', () => false)
  const error = useState<string | null>('admin-error', () => null)
  const initialized = useState<boolean>('admin-initialized', () => false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await apiLogin(password)
      token.value = res.data.token
      initialized.value = true
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    capsules.value = []
    pageInfo.value = {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    }
    error.value = null
    initialized.value = false
  }

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
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        logout()
      }
      error.value = e instanceof Error ? e.message : '查询失败'
    } finally {
      loading.value = false
    }
  }

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

  async function hydrateSession() {
    if (initialized.value) return

    if (!token.value) {
      initialized.value = true
      return
    }

    await fetchCapsules(0)
    initialized.value = true
  }

  return {
    token,
    capsules,
    pageInfo,
    loading,
    error,
    isLoggedIn,
    initialized,
    login,
    logout,
    hydrateSession,
    fetchCapsules,
    deleteCapsule,
  }
}
