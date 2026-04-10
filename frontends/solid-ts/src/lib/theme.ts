import { createSignal } from 'solid-js'

export type Theme = 'light' | 'dark'

const [theme, setTheme] = createSignal<Theme>('light')
let initialized = false

function applyTheme(next: Theme) {
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem('theme', next)
  } catch {
    // ignore
  }
}

function initTheme() {
  if (initialized || typeof document === 'undefined') return
  initialized = true
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    }
  } catch {
    // ignore
  }
  applyTheme(theme())
}

export function useTheme() {
  initTheme()

  function toggleTheme() {
    const next = theme() === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
  }

  return {
    theme,
    toggleTheme,
  }
}
