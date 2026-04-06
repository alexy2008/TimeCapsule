import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '@/hooks/useAdmin'
import AdminLogin from '@/components/AdminLogin'
import CapsuleTable from '@/components/CapsuleTable'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function AdminView() {
  const navigate = useNavigate()
  const {
    capsules, pageInfo, loading, error,
    isLoggedIn, login, logout, fetchCapsules, deleteCapsule,
  } = useAdmin()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState('')

  async function handleLogin(password: string) {
    try {
      await login(password)
    } catch {
      // error handled in hook
    }
  }

  function handleDelete(code: string) {
    setDeleteTarget(code)
    setShowDeleteConfirm(true)
  }

  async function confirmDelete() {
    setShowDeleteConfirm(false)
    await deleteCapsule(deleteTarget)
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchCapsules()
    }
  }, [isLoggedIn, fetchCapsules])

  return (
    <section id="view-admin" className="view active">
      <div className="view-header">
          <button className="btn-back" onClick={() => navigate('/')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              返回
          </button>
          <h2>系统管理</h2>
      </div>

      {!isLoggedIn ? (
          <AdminLogin
            loading={loading}
            error={error}
            onLogin={handleLogin}
          />
      ) : (
          <div className="cyber-glass" style={{ padding: '2rem' }}>
            <div className="dashboard-header flex-between mb-4 pb-4 border-bottom">
              <h3>胶囊列表</h3>
              <button className="btn btn-outline btn-sm" onClick={logout}>退出登录</button>
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
