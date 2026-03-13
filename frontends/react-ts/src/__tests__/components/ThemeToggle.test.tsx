import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '@/components/ThemeToggle'

vi.mock('@/hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    toggle: vi.fn(),
  })),
}))

import { useTheme } from '@/hooks/useTheme'

describe('ThemeToggle', () => {
  it('should render with moon icon in light mode', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', toggle: vi.fn() })
    render(<ThemeToggle />)

    expect(screen.getByTitle('切换到暗色模式')).toBeDefined()
  })

  it('should render with sun icon in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', toggle: vi.fn() })
    render(<ThemeToggle />)

    expect(screen.getByTitle('切换到亮色模式')).toBeDefined()
  })

  it('should call toggle when clicked', () => {
    const toggle = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', toggle })
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))
    expect(toggle).toHaveBeenCalled()
  })
})
