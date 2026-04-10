import { describe, expect, it } from 'vitest'
import { useTheme } from '@/lib/theme'

describe('theme store', () => {
  it('toggles theme and updates data-theme', () => {
    const { theme, toggleTheme } = useTheme()
    const initial = theme()
    toggleTheme()
    expect(theme()).not.toBe(initial)
    expect(document.documentElement.getAttribute('data-theme')).toBe(theme())
  })
})
