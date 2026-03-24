import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomeView from '@/views/HomeView'
import { useTechStack } from '@/hooks/useTechStack'

vi.mock('@/hooks/useTechStack', () => ({
  useTechStack: vi.fn(),
}))

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render backend and database info from server health data', () => {
    vi.mocked(useTechStack).mockReturnValue({
      techStack: {
        framework: 'Spring Boot 3',
        language: 'Java 21',
        database: 'SQLite',
      },
      loading: false,
      error: false,
    })

    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    )

    expect(screen.getByText('Spring Boot 3 · Java 21')).toBeDefined()
    expect(screen.getByText('SQLite')).toBeDefined()
  })

  it('should render fallback copy when tech stack data is unavailable', () => {
    vi.mocked(useTechStack).mockReturnValue({
      techStack: null,
      loading: false,
      error: true,
    })

    render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    )

    expect(screen.getAllByText('技术栈信息暂不可用')).toHaveLength(2)
  })
})
