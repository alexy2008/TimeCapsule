'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCapsule } from '@/api'
import CapsuleForm from '@/components/CapsuleForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import type { Capsule, CreateCapsuleForm } from '@/types'

export default function CreateClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<Capsule | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingForm, setPendingForm] = useState<CreateCapsuleForm | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSubmit(form: CreateCapsuleForm) {
    setPendingForm(form)
    setShowConfirm(true)
  }

  async function confirmCreate() {
    if (!pendingForm) return

    setShowConfirm(false)
    setLoading(true)
    setError(null)

    try {
      const result = await createCapsule(pendingForm)
      setCreated(result.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '创建失败')
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    if (!created) return

    navigator.clipboard.writeText(created.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setError('复制失败，请手动保存胶囊码')
    })
  }

  if (created) {
    return (
      <section id="view-created" className="view active">
        <div className="success-container cyber-glass text-center">
          <div className="status-icon success-glow">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>胶囊创建成功</h2>
          <p>您的时间胶囊已成功封存。</p>
          <div className="capsule-key-box">
            <span className="label">胶囊码</span>
            <div className="code-display mono-font glow-text">{created.code}</div>
            <button className="btn btn-icon btn-copy" onClick={copyCode} aria-label="Copy code">
              {copied ? '✓' : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
          <div
            className="cyber-glass"
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              borderColor: 'rgba(0, 240, 255, 0.28)',
              background: 'rgba(0, 240, 255, 0.07)',
              textAlign: 'left',
            }}
          >
            <div className="mono-font" style={{ color: 'var(--cyan)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              SAVE THIS CODE
            </div>
            <div style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.7 }}>
              请务必妥善保存胶囊码。它是开启此胶囊的唯一凭证，丢失后将无法找回或补发。
            </div>
          </div>
          <button className="btn btn-outline mt-6" onClick={() => router.push('/')}>返回首页</button>
        </div>
      </section>
    )
  }

  return (
    <section id="view-create" className="view active">
      <div className="view-header">
        <button className="btn-back" onClick={() => router.push('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>创建时间胶囊</h2>
      </div>

      {error && <div style={{ color: 'var(--magenta)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <CapsuleForm loading={loading} onSubmit={handleSubmit} />
      <ConfirmDialog
        visible={showConfirm}
        title="确认创建"
        message={`确定要创建标题为「${pendingForm?.title}」的时间胶囊吗？\n\n胶囊一经创建，内容和开启时间将无法修改，也无法删除。`}
        onConfirm={confirmCreate}
        onCancel={() => setShowConfirm(false)}
      />
    </section>
  )
}
