/**
 * API 客户端模块
 * Next 全栈实现虽然前后端同仓，但页面代码仍通过统一 API 层访问 Route Handler，
 * 这样更容易和前后端分离实现对照阅读。
 */
import type { ApiResponse, Capsule, CreateCapsuleForm, HealthInfo, PageData } from '@/types'

const BASE_URL = '/api/v1'

/**
 * 通用请求封装。
 * 对页面层来说，它把“请求是否成功”和“返回什么业务数据”压缩成同一种接口。
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const { headers: customHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders as Record<string, string>,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const rawBody = response.status === 204 ? '' : await response.text()
  let data: ApiResponse<T> | null = null

  if (rawBody) {
    if (contentType.includes('application/json')) {
      data = JSON.parse(rawBody) as ApiResponse<T>
    } else if (!response.ok) {
      throw new Error(rawBody || `请求失败 (${response.status})`)
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `请求失败 (${response.status})`)
  }

  if (!data) {
    return {
      success: true,
      data: null as T,
    }
  }

  if (!data.success) {
    throw new Error(data.message || `请求失败 (${response.status})`)
  }

  return data
}

/**
 * 创建时把浏览器本地日期转换成 ISO 字符串，和其他实现保持一致。
 */
export function createCapsule(form: CreateCapsuleForm): Promise<ApiResponse<Capsule>> {
  return request<Capsule>('/capsules', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      openAt: new Date(form.openAt).toISOString(),
    }),
  })
}

/**
 * 详情接口是否返回 content，仍由服务端业务规则决定。
 */
export function getCapsule(code: string): Promise<ApiResponse<Capsule>> {
  return request<Capsule>(`/capsules/${code}`)
}

/**
 * 登录接口成功后会由服务端把 token 写入 cookie。
 */
export function adminLogin(password: string): Promise<ApiResponse<{ token: string }>> {
  return request<{ token: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function adminLogout(): Promise<ApiResponse<null>> {
  return request<null>('/admin/logout', {
    method: 'POST',
  })
}

/**
 * 管理端请求不需要手工拼 Authorization 头，
 * 因为同源请求会自动携带服务端设置的管理员 cookie。
 */
export function getAdminCapsules(page = 0, size = 20): Promise<ApiResponse<PageData<Capsule>>> {
  return request<PageData<Capsule>>(`/admin/capsules?page=${page}&size=${size}`, {
  })
}

/**
 * 删除接口走同样的 cookie 认证链路。
 */
export function deleteAdminCapsule(code: string): Promise<ApiResponse<null>> {
  return request<null>(`/admin/capsules/${code}`, {
    method: 'DELETE',
  })
}

/**
 * health 接口除了存活检测，也为首页技术栈展示提供数据。
 */
export function getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
  return request<HealthInfo>('/health')
}
