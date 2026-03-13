import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '@/components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('should not render when not visible', () => {
    render(
      <ConfirmDialog
        visible={false}
        title="确认"
        message="确认操作？"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.queryByText('确认')).toBeNull()
  })

  it('should render when visible', () => {
    render(
      <ConfirmDialog
        visible={true}
        title="确认删除"
        message="确认要删除吗？"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('确认删除')).toBeDefined()
    expect(screen.getByText('确认要删除吗？')).toBeDefined()
  })

  it('should call onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        visible={true}
        title="确认"
        message="确认操作？"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '确认' }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        visible={true}
        title="确认"
        message="确认操作？"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    fireEvent.click(screen.getByText('取消'))
    expect(onCancel).toHaveBeenCalled()
  })
})
