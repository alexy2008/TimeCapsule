/**
 * Angular 版本的共享类型定义。
 * 这些接口刻意与 Vue / React / Svelte 版本对齐，便于对照不同框架下的相同业务模型。
 */

export interface Capsule {
  code: string
  title: string
  content?: string | null // 开启前通常为 null，由后端决定是否可见
  creator: string
  openAt: string // ISO 8601 UTC 字符串
  createdAt: string
  opened?: boolean
}

export interface CreateCapsuleForm {
  title: string
  content: string
  creator: string
  openAt: string // 前端侧一般来自 datetime-local 输入
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errorCode?: string // 失败场景下供页面层做更细的交互判断
}

export interface PageData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // 当前页码从 0 开始
  size: number
}

export interface AdminToken {
  token: string
}

export interface TechStack {
  framework: string
  language: string
  database: string
}

export interface HealthInfo {
  status: string
  timestamp: string
  techStack: TechStack
}
