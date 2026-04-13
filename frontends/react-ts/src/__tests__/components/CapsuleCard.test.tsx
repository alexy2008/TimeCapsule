import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CapsuleCard from '@/components/CapsuleCard'

describe('CapsuleCard', () => {
  it('should render opened capsule with content', () => {
    render(
      <CapsuleCard
        capsule={{
          code: 'ABC12345',
          title: '测试标题',
          content: '测试内容',
          creator: '测试者',
          openAt: '2020-01-01T00:00:00Z',
          createdAt: '2019-01-01T00:00:00Z',
          opened: true,
        }}
      />
    )

    expect(screen.getByText('测试标题')).toBeDefined()
    expect(screen.getByText('已解锁')).toBeDefined()
    expect(screen.getByText('测试内容')).toBeDefined()
  })

  it('should render locked capsule without content', () => {
    render(
      <CapsuleCard
        capsule={{
          code: 'ABC12345',
          title: '未来胶囊',
          content: null,
          creator: '测试者',
          openAt: '2099-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          opened: false,
        }}
      />
    )

    expect(screen.getByText('未来胶囊')).toBeDefined()
    expect(screen.getByText('未到时间')).toBeDefined()
    expect(screen.getByText('开启时间:')).toBeDefined()
  })
})
