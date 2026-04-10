export interface Capsule {
  code: string
  title: string
  content: string | null
  creator: string
  openAt: string
  createdAt: string
  opened?: boolean
}

export interface CreateCapsuleForm {
  title: string
  content: string
  creator: string
  openAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errorCode?: string
}

export interface PageData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
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
