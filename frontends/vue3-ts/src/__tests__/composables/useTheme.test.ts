import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '@/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    const { theme } = useTheme()

    theme.value = 'light'
    document.documentElement.removeAttribute('data-theme')

    if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
      localStorage.clear()
    }
  })

  it('should default to light theme', () => {
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should toggle theme', () => {
    const { theme, toggle } = useTheme()
    toggle()
    expect(theme.value).toBe('dark')
    toggle()
    expect(theme.value).toBe('light')
  })
})
