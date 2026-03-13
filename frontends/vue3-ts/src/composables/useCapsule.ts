/**
 * 胶囊 Composable
 * 封装时间胶囊的核心业务逻辑：创建、查询
 * 响应式状态管理，可在任意组件中使用
 */
import { ref } from 'vue'
import type { Capsule, CreateCapsuleForm } from '@/types'
import { createCapsule as apiCreate, getCapsule as apiGet } from '@/api'

export function useCapsule() {
  // 响应式状态
  const capsule = ref<Capsule | null>(null)  // 当前胶囊数据
  const loading = ref(false)                 // 加载状态
  const error = ref<string | null>(null)     // 错误信息

  /**
   * 创建时间胶囊
   * 调用 API 并更新响应式状态
   *
   * @param form 表单数据
   * @returns 创建成功的胶囊对象
   * @throws 创建失败时抛出异常
   */
  async function create(form: CreateCapsuleForm) {
    loading.value = true
    error.value = null
    try {
      const res = await apiCreate(form)
      capsule.value = res.data
      return res.data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '创建失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 查询胶囊详情
   * 调用 API 并更新响应式状态
   *
   * @param code 8 位胶囊码
   * @returns 胶囊对象（时间未到时 content 为 null）
   * @throws 查询失败时抛出异常
   */
  async function get(code: string) {
    loading.value = true
    error.value = null
    try {
      const res = await apiGet(code)
      capsule.value = res.data
      return res.data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '查询失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  // 暴露响应式状态和方法供组件使用
  return { capsule, loading, error, create, get }
}
