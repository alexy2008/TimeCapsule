import type { Capsule, CreateCapsuleForm } from '@/types'
import { createCapsule as apiCreate, getCapsule as apiGet } from '@/utils/api'

export function useCapsule() {
  const capsule = useState<Capsule | null>('capsule-current', () => null)
  const loading = useState<boolean>('capsule-loading', () => false)
  const error = useState<string | null>('capsule-error', () => null)

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

  function clear() {
    capsule.value = null
    error.value = null
  }

  return { capsule, loading, error, create, get, clear }
}
