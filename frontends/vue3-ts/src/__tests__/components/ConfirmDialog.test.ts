import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('should not render when not visible', () => {
    const wrapper = mount(ConfirmDialog, {
      props: { visible: false, title: '确认', message: '确定吗？' },
    })
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })

  it('should render when visible', () => {
    const wrapper = mount(ConfirmDialog, {
      props: { visible: true, title: '确认', message: '确定吗？' },
      global: { stubs: { teleport: true } },
    })
    expect(wrapper.text()).toContain('确认')
    expect(wrapper.text()).toContain('确定吗？')
  })

  it('should emit confirm on confirm click', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: { visible: true, title: '确认', message: '确定吗？' },
      global: { stubs: { teleport: true } },
    })

    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('should emit cancel on cancel click', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: { visible: true, title: '确认', message: '确定吗？' },
      global: { stubs: { teleport: true } },
    })

    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })
})
