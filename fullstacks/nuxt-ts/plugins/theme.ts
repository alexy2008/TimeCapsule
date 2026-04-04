type Theme = 'light' | 'dark'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<Theme>('theme', {
    sameSite: 'lax',
    default: () => 'light',
  })
  const theme = useState<Theme>('theme', () => themeCookie.value || 'light')

  if (import.meta.server) {
    if (isTheme(themeCookie.value)) {
      theme.value = themeCookie.value
    }
    return
  }

  const local = localStorage.getItem('theme')
  const preferred = isTheme(local)
    ? local
    : isTheme(themeCookie.value)
      ? themeCookie.value
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

  theme.value = preferred
  themeCookie.value = preferred
  document.documentElement.setAttribute('data-theme', preferred)
  localStorage.setItem('theme', preferred)
})
