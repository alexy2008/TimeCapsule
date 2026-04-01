import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function AppHeader() {
  const navigate = useNavigate()

  return (
    <header className="app-header">
        <button
          type="button"
          className="logo"
          onClick={() => navigate('/')}
          aria-label="返回首页"
          style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }}
        >
            <img
              src="/favicon.svg"
              alt="HelloTime"
              style={{ width: '28px', height: '28px', display: 'block' }}
            />
            <span className="text">HelloTime</span>
        </button>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center' }}>
            <nav className="top-nav">
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>关于</NavLink>
            </nav>
            <ThemeToggle />
        </div>
    </header>
  )
}
