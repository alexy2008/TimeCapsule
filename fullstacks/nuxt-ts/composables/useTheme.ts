type Theme = 'light' | 'dark'

export function useTheme() {
  const themeCookie = useCookie<Theme>('theme', {
    sameSite: 'lax',
    default: () => 'light',
  })
  const theme = useState<Theme>('theme', () => themeCookie.value || 'light')

  function applyTheme(nextTheme: Theme) {
    theme.value = nextTheme
    themeCookie.value = nextTheme

    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('theme', nextTheme)
    }
  }

  function toggle() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, toggle }
}
