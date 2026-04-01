import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { __resetTechStackForTests, useTechStack } from '@/hooks/useTechStack'
import { getHealthInfo } from '@/api'

vi.mock('@/api', () => ({
  getHealthInfo: vi.fn(),
}))

describe('useTechStack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __resetTechStackForTests()
  })

  it('should load tech stack successfully', async () => {
    vi.mocked(getHealthInfo).mockResolvedValue({
      success: true,
      data: {
        status: 'UP',
        timestamp: '2026-03-23T00:00:00Z',
        techStack: {
          framework: 'Spring Boot 3',
          language: 'Java 21',
          database: 'SQLite',
        },
      },
    })

    const { result } = renderHook(() => useTechStack())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.techStack).toEqual({
      framework: 'Spring Boot 3',
      language: 'Java 21',
      database: 'SQLite',
    })
    expect(result.current.error).toBe(false)
  })

  it('should expose error state when request fails', async () => {
    vi.mocked(getHealthInfo).mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useTechStack())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.techStack).toBeNull()
    expect(result.current.error).toBe(true)
  })
})
