import { fireEvent, render, screen } from '@solidjs/testing-library'
import { describe, expect, it, vi } from 'vitest'
import CapsuleForm from '@/components/CapsuleForm'

describe('CapsuleForm', () => {
  it('renders labels and validates required fields', async () => {
    const handleSubmit = vi.fn()
    render(() => <CapsuleForm onSubmit={handleSubmit} />)

    expect(screen.getByLabelText('标题')).toBeInTheDocument()
    expect(screen.getByLabelText('内容')).toBeInTheDocument()
    expect(screen.getByLabelText('发布者')).toBeInTheDocument()
    expect(screen.getByLabelText('开启时间')).toBeInTheDocument()

    fireEvent.submit(screen.getByRole('button', { name: '封存胶囊' }))

    expect(await screen.findByText('请输入标题')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
