import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCapsule } from '@/composables/useCapsule'

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
    mockCreate.mockResolvedValue(mockResponse as any)

    const { create, capsule, loading, error } = useCapsule()

    const result = await create({ title: '测试', content: '内容', creator: '测试者', openAt: '2030-01-01T00:00' })

    expect(result.code).toBe('ABC12345')
    expect(capsule.value?.code).toBe('ABC12345')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should handle create error', async () => {
    mockCreate.mockRejectedValue(new Error('创建失败'))

    const { create, error } = useCapsule()

    await expect(create({ title: '测试', content: '内容', creator: '测试者', openAt: '2030-01-01T00:00' })).rejects.toThrow()
    expect(error.value).toBe('创建失败')
  })

  it('should get capsule successfully', async () => {
    const mockResponse = {
      success: true,
      data: { code: 'ABC12345', title: '测试', opened: false, creator: '测试者', openAt: '2030-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
    }
    mockGet.mockResolvedValue(mockResponse as any)

    const { get, capsule } = useCapsule()

    await get('ABC12345')
    expect(capsule.value?.code).toBe('ABC12345')
    expect(capsule.value?.opened).toBe(false)
  })

  it('should handle get error', async () => {
    mockGet.mockRejectedValue(new Error('胶囊不存在'))

    const { get, error } = useCapsule()

    await expect(get('NONEXIST')).rejects.toThrow()
    expect(error.value).toBe('胶囊不存在')
  })
})
