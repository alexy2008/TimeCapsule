import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Capsule, CreateCapsuleForm } from '@/types'
import { useCapsule } from '@/hooks/useCapsule'
import CapsuleForm from '@/components/CapsuleForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import styles from './CreateView.module.css'

export default function CreateView() {
  const { loading, error, create } = useCapsule()
  const [created, setCreated] = useState<Capsule | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingForm, setPendingForm] = useState<CreateCapsuleForm | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSubmit(form: CreateCapsuleForm) {
    setPendingForm(form)
    setShowConfirm(true)
  }

  async function confirmCreate() {
    setShowConfirm(false)
    if (!pendingForm) return
    try {
      const result = await create(pendingForm)
      setCreated(result)
    } catch {
      // error handled in hook
    }
  }

  function copyCode() {
    if (created) {
      navigator.clipboard.writeText(created.code).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="page">
      <div className="container container-sm">
        <div className="page-header">
          <h1>创建时间胶囊</h1>
          <p>封存你的心意，在未来开启</p>
        </div>

        {created ? (
          <div className={`card ${styles.successCard} text-center`}>
            <div className={styles.successIcon}>&#10004;</div>
            <h2>胶囊创建成功！</h2>
            <p className="text-secondary mt-2">你的胶囊码是：</p>
            <p className={styles.capsuleCode}>{created.code}</p>
            <p className="text-sm text-secondary mt-2">请记住这个胶囊码，它是开启胶囊的唯一凭证</p>
            <div className="flex justify-center gap-3 mt-6">
              <button className="btn btn-secondary" onClick={copyCode}>{copied ? '已复制！' : '复制胶囊码'}</button>
              <Link to={`/open/${created.code}`} className="btn btn-primary">查看胶囊</Link>
            </div>
          </div>
        ) : (
          <>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <CapsuleForm loading={loading} onSubmit={handleSubmit} />
            <ConfirmDialog
              visible={showConfirm}
              title="确认创建"
              message={`确定要创建标题为「${pendingForm?.title}」的时间胶囊吗？`}
              onConfirm={confirmCreate}
              onCancel={() => setShowConfirm(false)}
            />
          </>
        )}
      </div>
    </div>
  )
}
