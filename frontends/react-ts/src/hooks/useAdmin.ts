/**
 * 管理员 Hook
 * 封装管理员功能的业务逻辑：登录、登出、胶囊管理
 * Token 存储在 sessionStorage 中，会话结束自动清除
 * 使用 useSyncExternalStore 实现 token 跨组件共享
 */
import { useState, useCallback, useSyncExternalStore } from 'react'
import type { Capsule, PageData } from '@/types'
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '@/api'

// 模块级共享 token 状态
let token: string | null =
  typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_token') : null
const tokenListeners = new Set<() => void>()

function subscribeToken(callback: () => void) {
  tokenListeners.add(callback)
  return () => { tokenListeners.delete(callback) }
}

function getTokenSnapshot(): string | null {
  return token
}

function setToken(t: string | null) {
  token = t
  if (t) {
    sessionStorage.setItem('admin_token', t)
  } else {
    sessionStorage.removeItem('admin_token')
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
    setToken(null)
    setCapsules([])
  }, [])

  const fetchCapsules = useCallback(async (page = 0) => {
    const t = token // 直接读模块级变量，避免闭包问题
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
      if (e instanceof Error && e.message.includes('认证')) {
        setToken(null)
        setCapsules([])
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
      // 刷新当前页 — 读取最新 pageInfo
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
