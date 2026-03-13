import { useState, useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import AdminLogin from '@/components/AdminLogin'
import CapsuleTable from '@/components/CapsuleTable'
import ConfirmDialog from '@/components/ConfirmDialog'
import styles from './AdminView.module.css'

export default function AdminView() {
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState('')

  async function handleLogin(password: string) {
    try {
      await login(password)
      await fetchCapsules()
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
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>管理后台</h1>
        </div>

        {!isLoggedIn ? (
          <AdminLogin
            loading={loading}
            error={error}
            onLogin={handleLogin}
          />
        ) : (
          <>
            <div className={styles.adminBar}>
              <p className="text-sm text-secondary">已登录为管理员</p>
              <button className="btn btn-secondary btn-sm" onClick={logout}>退出登录</button>
            </div>

            <CapsuleTable
              capsules={capsules}
              pageInfo={pageInfo}
              loading={loading}
              onDelete={handleDelete}
              onPage={fetchCapsules}
              onRefresh={() => fetchCapsules(pageInfo.number)}
            />

            <ConfirmDialog
              visible={showDeleteConfirm}
              title="确认删除"
              message={`确定要删除胶囊 ${deleteTarget} 吗？此操作不可恢复。`}
              onConfirm={confirmDelete}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          </>
        )}
      </div>
    </div>
  )
}
