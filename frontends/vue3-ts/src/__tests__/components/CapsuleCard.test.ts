import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CapsuleCard from '@/components/CapsuleCard.vue'

describe('CapsuleCard', () => {
  const openedCapsule = {
    code: 'ABC12345',
    title: '已开启的胶囊',
    content: '这是内容',
    creator: '测试者',
    openAt: '2020-01-01T00:00:00Z',
    createdAt: '2019-01-01T00:00:00Z',
    opened: true,
  }

  const lockedCapsule = {
    code: 'XYZ99999',
    title: '未开启的胶囊',
    creator: '测试者',
    openAt: '2099-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    opened: false,
  }

  it('should display content when opened', () => {
    const wrapper = mount(CapsuleCard, { props: { capsule: openedCapsule } })

    expect(wrapper.text()).toContain('已开启的胶囊')
    expect(wrapper.text()).toContain('这是内容')
    expect(wrapper.text()).toContain('已开启')
  })

  it('should hide content when locked', () => {
    const wrapper = mount(CapsuleCard, { props: { capsule: lockedCapsule } })

    expect(wrapper.text()).toContain('未开启的胶囊')
    expect(wrapper.text()).not.toContain('这是内容')
    expect(wrapper.text()).toContain('未到时间')
  })
})
