'use client'

import { useState, useMemo, type FormEvent } from 'react'
import type { CreateCapsuleForm } from '@/types'
import styles from './CapsuleForm.module.css'

interface Props {
  loading?: boolean
  onSubmit: (form: CreateCapsuleForm) => void
}

export default function CapsuleForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CreateCapsuleForm>({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })

  const minDateTime = useMemo(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }, [])

  function validate(): boolean {
    let valid = true
    const newErrors = { title: '', content: '', creator: '', openAt: '' }

    if (!form.title.trim()) {
      newErrors.title = '请输入标题'
      valid = false
    }
    if (!form.content.trim()) {
      newErrors.content = '请输入内容'
      valid = false
    }
    if (!form.creator.trim()) {
      newErrors.creator = '请输入发布者昵称'
      valid = false
    }
    if (!form.openAt) {
      newErrors.openAt = '请选择开启时间'
      valid = false
    } else if (new Date(form.openAt) <= new Date()) {
      newErrors.openAt = '开启时间必须在未来'
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSubmit({ ...form })
    }
  }

  function updateField(field: keyof CreateCapsuleForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form className={`cyber-form cyber-glass ${styles.capsuleForm}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="capsule-title">标题</label>
        <input
          id="capsule-title"
          className={`cyber-input ${errors.title ? 'error' : ''}`}
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="给时间胶囊取个名字"
          maxLength={100}
        />
        {errors.title && <p className="input-error-text" style={{color: 'var(--magenta)', marginTop: '0.5rem', fontSize: '0.85rem'}}>{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="capsule-content">内容</label>
        <textarea
          id="capsule-content"
          className={`cyber-input textarea ${errors.content ? 'error' : ''}`}
          value={form.content}
          onChange={e => updateField('content', e.target.value)}
          placeholder="写下你想对未来说的话..."
          rows={6}
        />
        {errors.content && <p className="input-error-text" style={{color: 'var(--magenta)', marginTop: '0.5rem', fontSize: '0.85rem'}}>{errors.content}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={`form-group ${styles.formGroup}`}>
          <label htmlFor="capsule-creator">发布者</label>
          <input
            id="capsule-creator"
            className={`cyber-input ${errors.creator ? 'error' : ''}`}
            value={form.creator}
            onChange={e => updateField('creator', e.target.value)}
            placeholder="你的昵称"
            maxLength={30}
          />
          <div className={styles.fieldMeta}>
            {errors.creator ? (
              <p className="input-error-text" style={{color: 'var(--magenta)', marginTop: '0.5rem', fontSize: '0.85rem'}}>
                {errors.creator}
              </p>
            ) : (
              <span className={styles.metaSpacer} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className={`form-group ${styles.formGroup}`}>
          <label htmlFor="capsule-open-at">开启时间</label>
          <input
            id="capsule-open-at"
            type="datetime-local"
            className={`cyber-input ${errors.openAt ? 'error' : ''}`}
            value={form.openAt}
            onChange={e => updateField('openAt', e.target.value)}
            min={minDateTime}
          />
          <div className={styles.fieldMeta}>
            {errors.openAt && (
              <p className="input-error-text" style={{color: 'var(--magenta)', marginTop: '0.5rem', fontSize: '0.85rem'}}>
                {errors.openAt}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-glow" disabled={loading}>
          <span className="btn-text">{loading ? '创建中...' : '封存胶囊'}</span>
          <div className="btn-scanner"></div>
        </button>
      </div>
    </form>
  )
}
