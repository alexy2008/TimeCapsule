import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from '@/components/ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('should render toggle button', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should toggle on click', async () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')

    expect(wrapper.find('.moon-icon').exists()).toBe(true)
    await button.trigger('click')
    expect(wrapper.find('.sun-icon').exists()).toBe(true)
  })
})
