import { createSignal } from 'solid-js'

interface AdminLoginProps {
  loading?: boolean
  error?: string | null
  onLogin: (password: string) => void
}

export default function AdminLogin(props: AdminLoginProps) {
  const [password, setPassword] = createSignal('')

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    if (password()) {
      props.onLogin(password())
    }
  }

  return (
    <div class="cyber-glass center-card" style={{ 'max-width': '450px' }}>
      <h3 class="mb-6">管理员登录</h3>
      <form onSubmit={handleSubmit}>
        <div class="form-group text-left">
          <label for="admin-password">管理员密码</label>
          <input
            id="admin-password"
            type="password"
            class="cyber-input text-center mono-font"
            value={password()}
            onInput={event => setPassword(event.currentTarget.value)}
            placeholder="******"
            autocomplete="current-password"
            required
          />
        </div>
        {props.error && <p style={{ color: 'var(--magenta)', 'margin-top': '0.5rem' }}>{props.error}</p>}
        <button type="submit" class="btn btn-primary" style={{ width: '100%', 'justify-content': 'center' }} disabled={props.loading || !password()}>
          {props.loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
