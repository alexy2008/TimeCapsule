import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.clear()
  })

  it('should default to light theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggle()
    })
    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggle()
    })
    expect(result.current.theme).toBe('light')
  })
})
