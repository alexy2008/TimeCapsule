/**
 * API 客户端模块
 * 封装与后端 REST API 的交互逻辑
 * 基础路径：/api/v1
 */
import type { ApiResponse, Capsule, CreateCapsuleForm, PageData, AdminToken, HealthInfo } from '@/types'

const BASE_URL = '/api/v1'

/**
 * 通用请求封装
 * 处理 JSON 序列化、统一错误处理
 *
 * @param url 请求路径（相对于 BASE_URL）
 * @param options Fetch 请求选项
 * @returns 解析后的响应数据
 * @throws 当响应 success=false 或 HTTP 状态码非 2xx 时抛出错误
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
 * 创建时间胶囊
 * POST /api/v1/capsules
 *
 * @param form 表单数据
 * @returns 创建成功的胶囊信息
 */
export function createCapsule(form: CreateCapsuleForm): Promise<ApiResponse<Capsule>> {
  return request<Capsule>('/capsules', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      openAt: new Date(form.openAt).toISOString(),  // 转换为 ISO 8601 格式
    }),
  })
}

/**
 * 查询胶囊详情
 * GET /api/v1/capsules/{code}
 *
 * @param code 8 位胶囊码
 * @returns 胶囊信息（时间未到时 content 为 null）
 */
export function getCapsule(code: string): Promise<ApiResponse<Capsule>> {
  return request<Capsule>(`/capsules/${code}`)
}

/**
 * 管理员登录
 * POST /api/v1/admin/login
 *
 * @param password 管理员密码
 * @returns JWT Token
 */
export function adminLogin(password: string): Promise<ApiResponse<AdminToken>> {
  return request<AdminToken>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

/**
 * 分页查询所有胶囊（管理员）
 * GET /api/v1/admin/capsules?page=0&size=20
 * 需要认证
 *
 * @param token JWT Token
 * @param page 页码（从 0 开始）
 * @param size 每页大小
 * @returns 胶囊列表分页数据
 */
export function getAdminCapsules(token: string, page = 0, size = 20): Promise<ApiResponse<PageData<Capsule>>> {
  return request<PageData<Capsule>>(`/admin/capsules?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * 删除胶囊（管理员）
 * DELETE /api/v1/admin/capsules/{code}
 * 需要认证
 *
 * @param token JWT Token
 * @param code 8 位胶囊码
 * @returns 删除结果
 */
export function deleteAdminCapsule(token: string, code: string): Promise<ApiResponse<null>> {
  return request<null>(`/admin/capsules/${code}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * 获取后端健康信息（含技术栈）
 * GET /api/v1/health
 */
export function getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
  return request<HealthInfo>('/health')
}
