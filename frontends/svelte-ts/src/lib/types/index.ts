/**
 * Svelte 版本的共享类型。
 * 这些接口和其他前端实现保持一致，方便读者横向比较而不被类型命名差异干扰。
 */

/**
 * 时间胶囊对象
 * 对应后端 CapsuleResponse DTO
 */
export interface Capsule {
  code: string           // 用户用来重新打开胶囊的唯一凭证
  title: string
  content?: string | null  // 未到开启时间时由后端返回 null
  creator: string
  openAt: string         // 服务端统一返回 ISO 8601 UTC 字符串
  createdAt: string
  opened?: boolean       // 仅表示当前响应时刻是否已到开启时间
}

/**
 * 创建胶囊表单数据类型
 * 用于表单输入和 API 请求
 */
export interface CreateCapsuleForm {
  title: string
  content: string
  creator: string
  openAt: string     // 浏览器侧通常来自 datetime-local 输入
}

/**
 * 统一 API 响应类型
 * 所有后端接口返回的统一格式
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errorCode?: string // 各技术栈共用同一错误码语义
}

/**
 * 分页数据类型
 * 用于分页列表展示
 */
export interface PageData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number         // 当前页码从 0 开始，和后端分页参数保持一致
  size: number
}

/**
 * 管理员 Token 类型
 * 登录成功后返回
 */
export interface AdminToken {
  token: string  // JWT Token
}

/**
 * 后端技术栈信息类型
 * 用于 health 接口响应
 */
export interface TechStack {
  framework: string
  language: string
  database: string
}

/**
 * health 接口除了健康检查，也承载首页技术栈展示数据。
 */
export interface HealthInfo {
  status: string
  timestamp: string
  techStack: TechStack
}
