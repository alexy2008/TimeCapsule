/**
 * API 客户端模块
 * 所有前后端分离实现都遵循同一套响应结构，因此这里适合作为初学者理解“统一 API 层”的入口。
 */
import type { ApiResponse, Capsule, CreateCapsuleForm, PageData, AdminToken, HealthInfo } from '@/types'
// import { fetch } from '@tauri-apps/plugin-http'

const BASE_URL = 'http://localhost:8080/api/v1'

/**
 * 通用请求封装。
 * 它把 fetch 的底层细节收拢到一个地方，让视图层只处理业务成功和业务失败。
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
    // 兼容 204 No Content 这类没有响应体的成功请求。
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
 * 创建时间胶囊。
 * 表单里的日期通常来自浏览器本地时区输入，这里统一转成 ISO 8601，再交给后端按 UTC 处理。
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
 * 查询胶囊详情。
 * 是否返回正文内容由后端决定，前端不在这里自行判断“是否已开启”。
 */
export function getCapsule(code: string): Promise<ApiResponse<Capsule>> {
  return request<Capsule>(`/capsules/${code}`)
}

/**
 * 管理员登录。
 */
export function adminLogin(password: string): Promise<ApiResponse<AdminToken>> {
  return request<AdminToken>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

/**
 * 管理端列表请求需要携带 Bearer Token。
 * 这个 token 由 hook 层保存在 sessionStorage 中，浏览器会话结束后自动失效。
 */
export function getAdminCapsules(token: string, page = 0, size = 20): Promise<ApiResponse<PageData<Capsule>>> {
  return request<PageData<Capsule>>(`/admin/capsules?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * 管理端删除接口。
 */
export function deleteAdminCapsule(token: string, code: string): Promise<ApiResponse<null>> {
  return request<null>(`/admin/capsules/${code}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * 健康接口除了检查服务是否可用，也承担“技术栈展示”的数据来源。
 */
export function getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
  return request<HealthInfo>('/health')
}
