import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CapsuleForm from '@/components/CapsuleForm.vue'

describe('CapsuleForm', () => {
  it('should render form fields', () => {
    const wrapper = mount(CapsuleForm)

    expect(wrapper.find('#capsule-title').exists()).toBe(true)
    expect(wrapper.find('#capsule-content').exists()).toBe(true)
    expect(wrapper.find('#capsule-creator').exists()).toBe(true)
    expect(wrapper.find('#capsule-open-at').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should show errors for empty submission', async () => {
    const wrapper = mount(CapsuleForm)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('请输入标题')
    expect(wrapper.text()).toContain('请输入内容')
    expect(wrapper.text()).toContain('请输入发布者昵称')
    expect(wrapper.text()).toContain('请选择开启时间')
  })

  it('should emit submit with valid data', async () => {
    const wrapper = mount(CapsuleForm)

    await wrapper.find('#capsule-title').setValue('测试标题')
    await wrapper.find('#capsule-content').setValue('测试内容')
    await wrapper.find('#capsule-creator').setValue('测试者')

    // Set a future date
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const dateStr = futureDate.toISOString().slice(0, 16)
    await wrapper.find('#capsule-open-at').setValue(dateStr)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    const emitted = wrapper.emitted('submit')!
    expect(emitted[0]![0]).toMatchObject({
      title: '测试标题',
      content: '测试内容',
      creator: '测试者',
    })
  })
})
