import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

// Mock localStorage for test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorageMock.clear()
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
