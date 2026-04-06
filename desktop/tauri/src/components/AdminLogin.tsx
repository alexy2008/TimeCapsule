import { useState, type FormEvent } from 'react'

interface Props {
  loading?: boolean
  error?: string | null
  onLogin: (password: string) => void
}

export default function AdminLogin({ loading, error, onLogin }: Props) {
  const [password, setPassword] = useState('')

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (password) {
      onLogin(password)
    }
  }

  return (
    <div className="cyber-glass center-card" style={{ maxWidth: '450px' }}>
      <h3 className="mb-6">管理员登录</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group text-left">
          <label htmlFor="admin-password">管理员密码</label>
          <input
            id="admin-password"
            type="password"
            className="cyber-input text-center mono-font"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="******"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p style={{color: 'var(--magenta)', marginTop: '0.5rem'}}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading || !password}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
