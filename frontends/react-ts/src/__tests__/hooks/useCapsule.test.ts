import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCapsule } from '@/hooks/useCapsule'

vi.mock('@/api', () => ({
  createCapsule: vi.fn(),
  getCapsule: vi.fn(),
}))

import { createCapsule, getCapsule } from '@/api'

const mockCreate = vi.mocked(createCapsule)
const mockGet = vi.mocked(getCapsule)

describe('useCapsule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create capsule successfully', async () => {
    const mockResponse = {
      success: true,
      data: { code: 'ABC12345', title: '测试', creator: '测试者', openAt: '2030-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
    }
    mockCreate.mockResolvedValue(mockResponse as ReturnType<typeof createCapsule> extends Promise<infer R> ? R : never)

    const { result } = renderHook(() => useCapsule())

    let res: unknown
    await act(async () => {
      res = await result.current.create({ title: '测试', content: '内容', creator: '测试者', openAt: '2030-01-01T00:00' })
    })

    expect((res as { code: string }).code).toBe('ABC12345')
    expect(result.current.capsule?.code).toBe('ABC12345')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle create error', async () => {
    mockCreate.mockRejectedValue(new Error('创建失败'))

    const { result } = renderHook(() => useCapsule())

    await act(async () => {
      try {
        await result.current.create({ title: '测试', content: '内容', creator: '测试者', openAt: '2030-01-01T00:00' })
      } catch {
        // expected
      }
    })

    expect(result.current.error).toBe('创建失败')
  })

  it('should get capsule successfully', async () => {
    const mockResponse = {
      success: true,
      data: { code: 'ABC12345', title: '测试', opened: false, creator: '测试者', openAt: '2030-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
    }
    mockGet.mockResolvedValue(mockResponse as ReturnType<typeof getCapsule> extends Promise<infer R> ? R : never)

    const { result } = renderHook(() => useCapsule())

    await act(async () => {
      await result.current.get('ABC12345')
    })

    expect(result.current.capsule?.code).toBe('ABC12345')
    expect(result.current.capsule?.opened).toBe(false)
  })

  it('should handle get error', async () => {
    mockGet.mockRejectedValue(new Error('胶囊不存在'))

    const { result } = renderHook(() => useCapsule())

    await act(async () => {
      try {
        await result.current.get('NONEXIST')
      } catch {
        // expected
      }
    })

    expect(result.current.error).toBe('胶囊不存在')
  })
})
