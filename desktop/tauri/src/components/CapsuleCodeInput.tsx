import { type KeyboardEvent } from 'react'

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
    <div className="search-container cyber-glass center-card">
        <p className="mb-6">输入8位胶囊码开启您的时间胶囊。</p>
        <div className="search-input-wrapper">
            <input
              type="text"
              className="cyber-input search-input mono-font text-center"
              placeholder="        "
              maxLength={8}
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyUp={handleKeyUp}
              autoComplete="off"
            />
            <div className="search-line-effect"></div>
        </div>
        {error && <p style={{color: 'var(--magenta)', marginTop: '1rem', textAlign: 'center'}}>{error}</p>}
        <div className="action-row mt-6">
            <button className="btn btn-primary" onClick={handleClick} disabled={loading || value.length !== 8}>
              {loading ? '查询中...' : '开启胶囊'}
            </button>
        </div>
    </div>
  )
}
