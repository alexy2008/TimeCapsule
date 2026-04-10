import { createMemo, createRoot, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { Capsule, PageData } from '@/types'
import { adminLogin, deleteAdminCapsule, getAdminCapsules } from '@/lib/api'

function emptyPageInfo(): Omit<PageData<Capsule>, 'content'> {
  return {
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  }
}

const adminStore = createRoot(() => {
  const [token, setToken] = createSignal<string | null>(null)
  const [capsules, setCapsules] = createSignal<Capsule[]>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [pageInfo, setPageInfo] = createStore<Omit<PageData<Capsule>, 'content'>>(emptyPageInfo())

  if (typeof sessionStorage !== 'undefined') {
    setToken(sessionStorage.getItem('admin_token'))
  }

  const isLoggedIn = createMemo(() => Boolean(token()))

  function persistToken(next: string | null) {
    setToken(next)
    if (typeof sessionStorage === 'undefined') return
    if (next) {
      sessionStorage.setItem('admin_token', next)
    } else {
      sessionStorage.removeItem('admin_token')
    }
  }

  function resetList() {
    setCapsules([])
    setPageInfo(emptyPageInfo())
  }

  async function login(password: string) {
    setLoading(true)
    setError(null)
    try {
      const response = await adminLogin(password)
      persistToken(response.data.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    persistToken(null)
    resetList()
    setError(null)
  }

  async function fetchCapsules(page = 0) {
    const currentToken = token()
    if (!currentToken) return
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminCapsules(currentToken, page)
      setCapsules(response.data.content)
      setPageInfo({
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        number: response.data.number,
        size: response.data.size,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '查询失败'
      if (message.includes('认证') || message.includes('未授权')) {
        persistToken(null)
        resetList()
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteCapsule(code: string) {
    const currentToken = token()
    if (!currentToken) return
    setLoading(true)
    setError(null)
    try {
      await deleteAdminCapsule(currentToken, code)
      await fetchCapsules(pageInfo.number)
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除失败'
      if (message.includes('认证') || message.includes('未授权')) {
        persistToken(null)
        resetList()
      }
      setError(message)
    } finally {
      setLoading(false)
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
})

export function useAdmin() {
  return adminStore
}
