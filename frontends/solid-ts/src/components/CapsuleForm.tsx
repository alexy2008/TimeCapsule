import { createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { CreateCapsuleForm } from '@/types'
import styles from './CapsuleForm.module.css'

interface CapsuleFormProps {
  loading?: boolean
  onSubmit: (form: CreateCapsuleForm) => void
}

export default function CapsuleForm(props: CapsuleFormProps) {
  const [form, setForm] = createStore<CreateCapsuleForm>({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })
  const [errors, setErrors] = createStore<Record<keyof CreateCapsuleForm, string>>({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })

  const minDateTime = createMemo(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })

  function validate() {
    const nextErrors = { title: '', content: '', creator: '', openAt: '' }
    let valid = true

    if (!form.title.trim()) {
      nextErrors.title = '请输入标题'
      valid = false
    }
    if (!form.content.trim()) {
      nextErrors.content = '请输入内容'
      valid = false
    }
    if (!form.creator.trim()) {
      nextErrors.creator = '请输入发布者昵称'
      valid = false
    }
    if (!form.openAt) {
      nextErrors.openAt = '请选择开启时间'
      valid = false
    } else if (new Date(form.openAt) <= new Date()) {
      nextErrors.openAt = '开启时间必须在未来'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    if (validate()) {
      props.onSubmit({ ...form })
    }
  }

  return (
    <form class={`cyber-form cyber-glass ${styles.capsuleForm}`} onSubmit={handleSubmit}>
      <div class="form-group">
        <label for="capsule-title">标题</label>
        <input
          id="capsule-title"
          class={`cyber-input ${errors.title ? 'error' : ''}`}
          value={form.title}
          onInput={event => setForm('title', event.currentTarget.value)}
          placeholder="给时间胶囊取个名字"
          maxLength={100}
        />
        {errors.title && <p class="input-error-text form-error">{errors.title}</p>}
      </div>

      <div class="form-group">
        <label for="capsule-content">内容</label>
        <textarea
          id="capsule-content"
          class={`cyber-input textarea ${errors.content ? 'error' : ''}`}
          value={form.content}
          onInput={event => setForm('content', event.currentTarget.value)}
          placeholder="写下你想对未来说的话..."
          rows={6}
        />
        {errors.content && <p class="input-error-text form-error">{errors.content}</p>}
      </div>

      <div class={styles.formRow}>
        <div class={`form-group ${styles.formGroup}`}>
          <label for="capsule-creator">发布者</label>
          <input
            id="capsule-creator"
            class={`cyber-input ${errors.creator ? 'error' : ''}`}
            value={form.creator}
            onInput={event => setForm('creator', event.currentTarget.value)}
            placeholder="你的昵称"
            maxLength={30}
          />
          <div class={styles.fieldMeta}>
            {errors.creator ? <p class="input-error-text form-error">{errors.creator}</p> : <span class={styles.metaSpacer} aria-hidden="true"></span>}
          </div>
        </div>

        <div class={`form-group ${styles.formGroup}`}>
          <label for="capsule-open-at">开启时间</label>
          <input
            id="capsule-open-at"
            type="datetime-local"
            class={`cyber-input ${errors.openAt ? 'error' : ''}`}
            value={form.openAt}
            onInput={event => setForm('openAt', event.currentTarget.value)}
            min={minDateTime()}
          />
          <div class={styles.fieldMeta}>
            {errors.openAt ? <p class="input-error-text form-error">{errors.openAt}</p> : <span class={styles.metaSpacer} aria-hidden="true"></span>}
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary btn-glow" disabled={props.loading}>
          <span class="btn-text">{props.loading ? '创建中...' : '封存胶囊'}</span>
          <div class="btn-scanner"></div>
        </button>
      </div>
    </form>
  )
}
