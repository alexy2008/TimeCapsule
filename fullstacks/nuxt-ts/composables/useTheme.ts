type Theme = 'light' | 'dark'

export function useTheme() {
  // Nuxt 版本同时用 cookie 和 useState 保存主题：
  // cookie 负责 SSR 首屏一致性，useState 负责当前应用内的响应式更新。
  const themeCookie = useCookie<Theme>('theme', {
    sameSite: 'lax',
    default: () => 'light',
  })
  const theme = useState<Theme>('theme', () => themeCookie.value || 'light')

  function applyTheme(nextTheme: Theme) {
    theme.value = nextTheme
    themeCookie.value = nextTheme

    if (import.meta.client) {
      // 只有浏览器端才需要操作 DOM 和 localStorage，服务端渲染阶段不会执行这里。
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('theme', nextTheme)
    }
  }

  function toggle() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, toggle }
}
