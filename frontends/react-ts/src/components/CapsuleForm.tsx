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
    <form className={styles.capsuleForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className="input-label" htmlFor="title">标题</label>
        <input
          id="title"
          className={`input ${errors.title ? 'input-error' : ''}`}
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="给时间胶囊取个名字"
          maxLength={100}
        />
        {errors.title && <p className="input-error-text">{errors.title}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className="input-label" htmlFor="content">内容</label>
        <textarea
          id="content"
          className={`input ${errors.content ? 'input-error' : ''}`}
          value={form.content}
          onChange={e => updateField('content', e.target.value)}
          placeholder="写下你想对未来说的话..."
          rows={5}
        />
        {errors.content && <p className="input-error-text">{errors.content}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={`${styles.formGroup} flex-1`}>
          <label className="input-label" htmlFor="creator">发布者</label>
          <input
            id="creator"
            className={`input ${errors.creator ? 'input-error' : ''}`}
            value={form.creator}
            onChange={e => updateField('creator', e.target.value)}
            placeholder="你的昵称"
            maxLength={30}
          />
          {errors.creator && <p className="input-error-text">{errors.creator}</p>}
        </div>

        <div className={`${styles.formGroup} flex-1`}>
          <label className="input-label" htmlFor="openAt">开启时间</label>
          <input
            id="openAt"
            type="datetime-local"
            className={`input ${errors.openAt ? 'input-error' : ''}`}
            value={form.openAt}
            onChange={e => updateField('openAt', e.target.value)}
            min={minDateTime}
          />
          {errors.openAt && <p className="input-error-text">{errors.openAt}</p>}
        </div>
      </div>

      <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
        {loading ? '创建中...' : '封存时间胶囊'}
      </button>
    </form>
  )
}
