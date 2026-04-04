'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, adminLogout, deleteAdminCapsule, getAdminCapsules } from '@/api'
import AdminLogin from '@/components/AdminLogin'
import CapsuleTable from '@/components/CapsuleTable'
import ConfirmDialog from '@/components/ConfirmDialog'
import type { Capsule, PageData } from '@/types'

interface Props {
  initialLoggedIn?: boolean
  initialPageData?: Omit<PageData<Capsule>, 'content'> & { content: Capsule[] }
}

function emptyPageInfo() {
  return {
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  }
}

export default function AdminClient({ initialLoggedIn = false, initialPageData }: Props) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn)
  const [capsules, setCapsules] = useState<Capsule[]>(initialPageData?.content ?? [])
  const [pageInfo, setPageInfo] = useState<Omit<PageData<Capsule>, 'content'>>(
    initialPageData
      ? {
          totalElements: initialPageData.totalElements,
          totalPages: initialPageData.totalPages,
          number: initialPageData.number,
          size: initialPageData.size,
        }
      : emptyPageInfo(),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(Boolean(initialPageData) || !initialLoggedIn)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState('')

  async function fetchCapsules(page = 0) {
    if (!isLoggedIn) return

    setLoading(true)
    setError(null)
    try {
      const res = await getAdminCapsules(page)
      setCapsules(res.data.content)
      setPageInfo({
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      })
      setHydrated(true)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '查询失败'
      if (message.includes('认证') || message.includes('未授权')) {
        setIsLoggedIn(false)
        setCapsules([])
        setPageInfo(emptyPageInfo())
      }
      setError(message)
      setHydrated(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(password: string) {
    setLoading(true)
    setError(null)
    try {
      await adminLogin(password)
      setIsLoggedIn(true)
      setHydrated(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    void adminLogout().catch(() => {})
    setIsLoggedIn(false)
    setCapsules([])
    setPageInfo(emptyPageInfo())
    setError(null)
    setHydrated(true)
  }

  function handleDelete(code: string) {
    setDeleteTarget(code)
    setShowDeleteConfirm(true)
  }

  async function confirmDelete() {
    setShowDeleteConfirm(false)
    setLoading(true)
    setError(null)
    try {
      await deleteAdminCapsule(deleteTarget)
      await fetchCapsules(pageInfo.number)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '删除失败'
      if (message.includes('认证') || message.includes('未授权')) {
        setIsLoggedIn(false)
        setCapsules([])
        setPageInfo(emptyPageInfo())
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn && !hydrated) {
      void fetchCapsules(0)
    }
  }, [isLoggedIn, hydrated])

  return (
    <section id="view-admin" className="view active">
      <div className="view-header">
        <button className="btn-back" onClick={() => router.push('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>系统管理</h2>
      </div>

      {!isLoggedIn ? (
        <AdminLogin loading={loading} error={error} onLogin={handleLogin} />
      ) : (
        <div className="cyber-glass" style={{ padding: '2rem' }}>
          <div className="dashboard-header flex-between mb-4 pb-4 border-bottom">
            <h3>胶囊列表</h3>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>退出登录</button>
          </div>

          {error && <div style={{ color: 'var(--magenta)', marginBottom: '1rem' }}>{error}</div>}

          <CapsuleTable
            capsules={capsules}
            pageInfo={pageInfo}
            loading={loading}
            onDelete={handleDelete}
            onPage={fetchCapsules}
          />

          <ConfirmDialog
            visible={showDeleteConfirm}
            title="确认删除"
            message={`确定要删除胶囊 ${deleteTarget} 吗？此操作不可恢复。`}
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </div>
      )}
    </section>
  )
}
