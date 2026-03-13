import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CapsuleForm from '@/components/CapsuleForm'

describe('CapsuleForm', () => {
  it('should render form fields', () => {
    render(<CapsuleForm onSubmit={() => {}} />)

    expect(screen.getByLabelText('标题')).toBeDefined()
    expect(screen.getByLabelText('内容')).toBeDefined()
    expect(screen.getByLabelText('发布者')).toBeDefined()
    expect(screen.getByLabelText('开启时间')).toBeDefined()
    expect(screen.getByRole('button', { name: '封存时间胶囊' })).toBeDefined()
  })

  it('should show errors for empty submission', async () => {
    render(<CapsuleForm onSubmit={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '封存时间胶囊' }))

    expect(screen.getByText('请输入标题')).toBeDefined()
    expect(screen.getByText('请输入内容')).toBeDefined()
    expect(screen.getByText('请输入发布者昵称')).toBeDefined()
    expect(screen.getByText('请选择开启时间')).toBeDefined()
  })

  it('should call onSubmit with valid data', async () => {
    const onSubmit = vi.fn()
    render(<CapsuleForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('标题'), { target: { value: '测试标题' } })
    fireEvent.change(screen.getByLabelText('内容'), { target: { value: '测试内容' } })
    fireEvent.change(screen.getByLabelText('发布者'), { target: { value: '测试者' } })

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const dateStr = futureDate.toISOString().slice(0, 16)
    fireEvent.change(screen.getByLabelText('开启时间'), { target: { value: dateStr } })

    fireEvent.click(screen.getByRole('button', { name: '封存时间胶囊' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '测试标题',
        content: '测试内容',
        creator: '测试者',
      })
    )
  })
})
