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

  it('should render unified tech stack card', () => {
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

    expect(screen.getByText('TECHNOLOGY STACK')).toBeDefined()
    expect(screen.getByText('React')).toBeDefined()
    expect(screen.getByText('TypeScript')).toBeDefined()
    expect(screen.getByText('Java')).toBeDefined()
    expect(screen.getByText('Spring Boot')).toBeDefined()
    expect(screen.getByText('SQLite')).toBeDefined()
    expect(screen.getByRole('button', { name: '创建胶囊' })).toBeDefined()
    expect(screen.getByRole('button', { name: '开启胶囊' })).toBeDefined()
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

    expect(screen.getAllByText('?')).toHaveLength(3)
  })
})
