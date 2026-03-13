import { type KeyboardEvent } from 'react'
import styles from './CapsuleCodeInput.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: (code: string) => void
  loading?: boolean
  error?: string | null
}

export default function CapsuleCodeInput({ value, onChange, onSubmit, loading, error }: Props) {
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter' && value.length === 8) {
      onSubmit(value)
    }
  }

  function handleClick() {
    if (value.length === 8) {
      onSubmit(value)
    }
  }

  return (
    <div className="code-input-group">
      <div className={styles.inputWrapper}>
        <input
          className={`input ${styles.codeInput}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="输入 8 位胶囊码"
          maxLength={8}
        />
        <button
          className="btn btn-primary"
          onClick={handleClick}
          disabled={loading || value.length !== 8}
        >
          {loading ? '查询中...' : '开启'}
        </button>
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  )
}
