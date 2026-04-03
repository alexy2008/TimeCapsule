/**
 * 管理员 Composable
 * 封装管理员功能的业务逻辑：登录、登出、胶囊管理
 * Token 存储在 sessionStorage 中，会话结束自动清除
 */
import { ref, computed } from 'vue'
import type { Capsule, PageData } from '@/types'
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '@/api'

/**
 * 持久化 Token
 * 从 sessionStorage 读取初始值（如果存在）
 */
const token = ref<string | null>(
  typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_token') : null
)

export function useAdmin() {
  // 响应式状态
  const capsules = ref<Capsule[]>([])                    // 胶囊列表
  const pageInfo = ref<Omit<PageData<Capsule>, 'content'>>({  // 分页信息（不含 content）
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  })
  const loading = ref(false)         // 加载状态
  const error = ref<string | null>(null)  // 错误信息

  /**
   * 计算属性：是否已登录
   * 根据 token 是否存在判断
   */
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 管理员登录
   * 登录成功后将 Token 存入 sessionStorage
   *
   * @param password 管理员密码
   * @throws 登录失败时抛出异常
   */
  async function login(password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await apiLogin(password)
      token.value = res.data.token
      sessionStorage.setItem('admin_token', res.data.token)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出
   * 清除 Token 和本地状态
   */
  function logout() {
    token.value = null
    sessionStorage.removeItem('admin_token')
    capsules.value = []
    pageInfo.value = {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    }
  }

  /**
   * 分页加载胶囊列表
   * 需要登录后才能调用
   *
   * @param page 页码（从 0 开始）
   */
  async function fetchCapsules(page = 0) {
    if (!token.value) return  // 未登录直接返回
    loading.value = true
    error.value = null
    try {
      const res = await getAdminCapsules(token.value, page)
      capsules.value = res.data.content
      pageInfo.value = {
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      }
    } catch (e: unknown) {
      // Token 过期或无效时自动登出
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        logout()
      }
      error.value = e instanceof Error ? e.message : '查询失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除胶囊
   * 删除成功后刷新当前页列表
   *
   * @param code 8 位胶囊码
   */
  async function deleteCapsule(code: string) {
    if (!token.value) return  // 未登录直接返回
    loading.value = true
    error.value = null
    try {
      await deleteAdminCapsule(token.value, code)
      await fetchCapsules(pageInfo.value.number)  // 刷新当前页
    } catch (e: unknown) {
      if (e instanceof Error && (e.message.includes('认证') || e.message.includes('未授权'))) {
        logout()
      }
      error.value = e instanceof Error ? e.message : '删除失败'
    } finally {
      loading.value = false
    }
  }

  // 暴露响应式状态和方法供组件使用
  return {
    token,
    capsules,
    pageInfo,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    fetchCapsules,
    deleteCapsule,
  }
}
