import { A } from '@solidjs/router'
import ThemeToggle from '@/components/ThemeToggle'

export default function AppHeader() {
  return (
    <header class="app-header">
      <A href="/" class="logo" aria-label="返回首页" style={{ 'text-decoration': 'none', color: 'inherit' }}>
        <img src="/favicon.svg" alt="HelloTime" style={{ width: '28px', height: '28px', display: 'block' }} />
        <span class="text">HelloTime</span>
      </A>
      <div class="header-actions" style={{ display: 'flex', 'align-items': 'center' }}>
        <nav class="top-nav">
          <A href="/about" activeClass="active">
            关于
          </A>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
