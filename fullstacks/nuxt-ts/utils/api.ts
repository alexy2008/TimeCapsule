import type { AdminToken, ApiResponse, Capsule, CreateCapsuleForm, HealthInfo, PageData } from '@/types'

const BASE_URL = '/api/v1'

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const { headers: customHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string> | undefined),
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
    return { success: true, data: null as T }
  }

  if (!data.success) {
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

export function deleteAdminCapsule(token: string, code: string): Promise<ApiResponse<null>> {
  return request<null>(`/admin/capsules/${code}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getHealthInfo(): Promise<ApiResponse<HealthInfo>> {
  return request<HealthInfo>('/health')
}
