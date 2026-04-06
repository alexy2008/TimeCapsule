/**
 * 管理员 Hook。
 * React 版本没有引入外部状态库，而是用 useSyncExternalStore 演示如何只靠 React 原生能力共享登录态。
 */
import { useState, useCallback, useSyncExternalStore } from 'react'
import type { Capsule, PageData } from '@/types'
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '@/api'

// token 放在模块级变量中，多个组件都可以订阅这份共享状态。
import { load } from '@tauri-apps/plugin-store'

let token: string | null = null
const tokenListeners = new Set<() => void>()
let adminStore: any = null

async function initAdminStore() {
  try {
    adminStore = await load('session.json', { autoSave: true } as any)
    const stored: any = await adminStore.get('admin_token')
    const t = stored?.value || stored
    if (typeof t === 'string') {
      token = t
      tokenListeners.forEach(l => l())
    }
  } catch (err) {
    console.error('Failed to load admin session store', err)
  }
}
initAdminStore()

function subscribeToken(callback: () => void) {
  tokenListeners.add(callback)
  return () => { tokenListeners.delete(callback) }
}

function getTokenSnapshot(): string | null {
  return token
}

function setToken(t: string | null) {
  token = t
  if (adminStore) {
    if (t) {
      adminStore.set('admin_token', t)
    } else {
      adminStore.delete('admin_token')
    }
  }
  tokenListeners.forEach(l => l())
}

export function useAdmin() {
  const currentToken = useSyncExternalStore(subscribeToken, getTokenSnapshot)
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [pageInfo, setPageInfo] = useState<Omit<PageData<Capsule>, 'content'>>({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoggedIn = !!currentToken

  const login = useCallback(async (password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiLogin(password)
      setToken(res.data.token)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '登录失败'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    // 登出时同时清空列表和分页信息，避免界面短暂显示旧数据。
    setToken(null)
    setCapsules([])
    setPageInfo({
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    })
  }, [])

  const fetchCapsules = useCallback(async (page = 0) => {
    // 这里直接读取模块级 token，避免异步回调拿到过期闭包里的旧值。
    const t = token
    if (!t) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminCapsules(t, page)
      setCapsules(res.data.content)
      setPageInfo({
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      })
    } catch (e: unknown) {
      // 后端返回未授权时，前端直接清理本地会话，让 UI 回到未登录状态。
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        setToken(null)
        setCapsules([])
        setPageInfo({
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 20,
        })
      }
      const msg = e instanceof Error ? e.message : '查询失败'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCapsule = useCallback(async (code: string) => {
    const t = token
    if (!t) return
    setLoading(true)
    setError(null)
    try {
      await deleteAdminCapsule(t, code)
      // 删除后保留当前页，符合管理台“继续留在当前位置”的交互预期。
      const currentPage = pageInfo.number
      const res = await getAdminCapsules(t, currentPage)
      setCapsules(res.data.content)
      setPageInfo({
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      })
    } catch (e: unknown) {
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        setToken(null)
        setCapsules([])
        setPageInfo({
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 20,
        })
      }
      const msg = e instanceof Error ? e.message : '删除失败'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [pageInfo.number])

  return {
    token: currentToken,
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
