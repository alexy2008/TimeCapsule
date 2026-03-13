import { useState, type FormEvent } from 'react'
import styles from './AdminLogin.module.css'

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
    <form className={`${styles.loginForm} card`} onSubmit={handleLogin}>
      <h2 className="text-center mb-4">管理员登录</h2>
      <div className={styles.formGroup}>
        <label className="input-label" htmlFor="password">密码</label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="输入管理员密码"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="input-error-text">{error}</p>}
      <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading || !password}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
