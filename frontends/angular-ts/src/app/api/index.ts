/**
 * API 客户端模块
 * 封装与后端 REST API 的交互逻辑
 * 基础路径：/api/v1
 */
import type { ApiResponse, Capsule, CreateCapsuleForm, PageData, AdminToken, HealthInfo } from '../types'

const BASE_URL = '/api/v1'

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const { headers: customHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders as Record<string, string>,
    },
  })

  const data: ApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message || `请求失败 (${response.status})`)
  }

  return data
}

export function createCapsule(form: CreateCapsuleForm): Promise<ApiResponse<Capsule>> {
  return request<Capsule>('/capsules', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      openAt: new Date(form.openAt).toISOString(),
    }),
  })
}

export function getCapsule(code: string): Promise<ApiResponse<Capsule>> {
  return request<Capsule>(`/capsules/${code}`)
}

export function adminLogin(password: string): Promise<ApiResponse<AdminToken>> {
  return request<AdminToken>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function getAdminCapsules(token: string, page = 0, size = 20): Promise<ApiResponse<PageData<Capsule>>> {
  return request<PageData<Capsule>>(`/admin/capsules?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * 删除指定的胶囊（管理员权限）
 * @param token 管理员认证令牌
 * @param code 胶囊的唯一代码
 * @returns 返回删除操作的结果
 */
export function deleteAdminCapsule(token: string, code: string): Promise<ApiResponse<null>> {
  return request<null>(`/admin/capsules/${code}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
  return request<HealthInfo>('/health')
}