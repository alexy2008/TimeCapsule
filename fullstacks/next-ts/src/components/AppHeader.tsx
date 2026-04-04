'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="app-header">
        <Link
          href="/"
          className="logo"
          aria-label="返回首页"
          style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textDecoration: 'none' }}
        >
            <img
              src="/favicon.svg"
              alt="HelloTime"
              style={{ width: '28px', height: '28px', display: 'block' }}
            />
            <span className="text">HelloTime</span>
        </Link>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center' }}>
            <nav className="top-nav">
                <Link href="/about" className={pathname === '/about' ? 'active' : ''}>关于</Link>
            </nav>
            <ThemeToggle />
        </div>
    </header>
  )
}
