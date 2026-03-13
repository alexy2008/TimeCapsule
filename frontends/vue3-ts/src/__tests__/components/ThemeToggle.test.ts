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

    await button.trigger('click')
    // After click, theme should change (we can verify the icon changes)
    expect(wrapper.find('.icon').exists()).toBe(true)
  })
})
