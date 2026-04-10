import { createEffect, createSignal, on } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useAdmin } from '@/lib/admin'
import AdminLogin from '@/components/AdminLogin'
import CapsuleTable from '@/components/CapsuleTable'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function AdminRoute() {
  const navigate = useNavigate()
  const admin = useAdmin()
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false)
  const [deleteTarget, setDeleteTarget] = createSignal('')

  createEffect(
    on(
      admin.isLoggedIn,
      loggedIn => {
        if (loggedIn) {
          void admin.fetchCapsules()
        }
      },
      { defer: false },
    ),
  )

  async function handleLogin(password: string) {
    try {
      await admin.login(password)
    } catch {
      // handled by state
    }
  }

  async function confirmDelete() {
    setShowDeleteConfirm(false)
    await admin.deleteCapsule(deleteTarget())
  }

  return (
    <section id="view-admin" class="view active">
      <div class="view-header">
        <button class="btn-back" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>系统管理</h2>
      </div>

      {!admin.isLoggedIn() ? (
        <AdminLogin loading={admin.loading()} error={admin.error()} onLogin={handleLogin} />
      ) : (
        <div class="cyber-glass" style={{ padding: '2rem' }}>
          <div class="dashboard-header flex-between mb-4 pb-4 border-bottom">
            <h3>胶囊列表</h3>
            <button class="btn btn-outline btn-sm" onClick={admin.logout}>
              退出登录
            </button>
          </div>

          {admin.error() && <div style={{ color: 'var(--magenta)', 'margin-bottom': '1rem' }}>{admin.error()}</div>}

          <CapsuleTable
            capsules={admin.capsules()}
            pageInfo={admin.pageInfo}
            loading={admin.loading()}
            onDelete={code => {
              setDeleteTarget(code)
              setShowDeleteConfirm(true)
            }}
            onPage={page => void admin.fetchCapsules(page)}
          />

          <ConfirmDialog
            visible={showDeleteConfirm()}
            title="确认删除"
            message={`确定要删除胶囊 ${deleteTarget()} 吗？此操作不可恢复。`}
            onConfirm={() => void confirmDelete()}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </div>
      )}
    </section>
  )
}
