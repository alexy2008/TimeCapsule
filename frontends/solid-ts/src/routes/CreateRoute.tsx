import { Show, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import CapsuleForm from '@/components/CapsuleForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import { createCapsule } from '@/lib/api'
import type { Capsule, CreateCapsuleForm } from '@/types'

export default function CreateRoute() {
  const navigate = useNavigate()
  const [created, setCreated] = createSignal<Capsule | null>(null)
  const [pendingForm, setPendingForm] = createSignal<CreateCapsuleForm | null>(null)
  const [showConfirm, setShowConfirm] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [copied, setCopied] = createSignal(false)

  function handleSubmit(form: CreateCapsuleForm) {
    setPendingForm(form)
    setShowConfirm(true)
  }

  async function confirmCreate() {
    const form = pendingForm()
    setShowConfirm(false)
    if (!form) return

    setLoading(true)
    setError(null)
    try {
      const response = await createCapsule(form)
      setCreated(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    const capsule = created()
    if (!capsule) return
    navigator.clipboard.writeText(capsule.code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Show
      when={created()}
      fallback={
        <section id="view-create" class="view active">
          <div class="view-header">
            <button class="btn-back" onClick={() => navigate('/')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              返回
            </button>
            <h2>创建时间胶囊</h2>
          </div>

          {error() && <div style={{ color: 'var(--magenta)', 'margin-bottom': '1rem', 'text-align': 'center' }}>{error()}</div>}
          <CapsuleForm loading={loading()} onSubmit={handleSubmit} />
          <ConfirmDialog
            visible={showConfirm()}
            title="确认创建"
            message={`确定要创建标题为「${pendingForm()?.title ?? ''}」的时间胶囊吗？\n\n胶囊一经创建，内容和开启时间将无法修改，也无法删除。`}
            onConfirm={confirmCreate}
            onCancel={() => setShowConfirm(false)}
          />
        </section>
      }
    >
      {capsule => (
        <section id="view-created" class="view active">
          <div class="success-container cyber-glass text-center">
            <div class="status-icon success-glow">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>胶囊创建成功</h2>
            <p>您的时间胶囊已成功封存。</p>
            <div class="capsule-key-box">
              <span class="label">胶囊码</span>
              <div class="code-display mono-font glow-text">{capsule().code}</div>
              <button class="btn btn-icon btn-copy" onClick={copyCode} aria-label="Copy code">
                {copied() ? (
                  '✓'
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            <div
              class="cyber-glass"
              style={{
                'margin-top': '1.25rem',
                padding: '1rem 1.25rem',
                'border-color': 'rgba(0, 240, 255, 0.28)',
                background: 'rgba(0, 240, 255, 0.07)',
                'text-align': 'left',
              }}
            >
              <div class="mono-font" style={{ color: 'var(--cyan)', 'font-size': '0.8rem', 'margin-bottom': '0.4rem' }}>
                SAVE THIS CODE
              </div>
              <div style={{ margin: 0, color: 'var(--text-primary)', 'line-height': 1.7 }}>
                请务必妥善保存胶囊码。它是开启此胶囊的唯一凭证，丢失后将无法找回或补发。
              </div>
            </div>
            <button class="btn btn-outline mt-6" onClick={() => navigate('/')}>
              返回首页
            </button>
          </div>
        </section>
      )}
    </Show>
  )
}
