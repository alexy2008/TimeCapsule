/**
 * Next 全栈实现的共享类型。
 * 它们同时服务客户端组件和 Route Handler 调用结果，因此保持尽量朴素、框架无关。
 */

/**
 * 时间胶囊对象
 * 对应后端 CapsuleResponse DTO
 */
export interface Capsule {
  code: string           // 用户打开胶囊时需要输入的唯一代码
  title: string
  content?: string | null  // 公开详情接口在未到时间时返回 null
  creator: string
  openAt: string         // ISO 8601 UTC 时间，便于服务端和客户端统一处理
  createdAt: string
  opened?: boolean
}

/**
 * 创建胶囊表单数据类型
 * 用于表单输入和 API 请求
 */
export interface CreateCapsuleForm {
  title: string
  content: string
  creator: string
  openAt: string
}

/**
 * 统一 API 响应类型
 * 所有后端接口返回的统一格式
 */
export interface ApiResponse<T> {
  success: boolean   // 请求是否成功
  data: T            // 响应数据
  message?: string   // 响应消息
  errorCode?: string // 同一错误码语义也会被 Nuxt 和分离前端实现复用
}

/**
 * 分页数据类型
 * 用于分页列表展示
 */
export interface PageData<T> {
  content: T[]           // 当前页数据
  totalElements: number  // 总元素数
  totalPages: number     // 总页数
  number: number         // 当前页码从 0 开始
  size: number           // 每页大小
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
  framework: string  // 框架名称和版本
  language: string   // 编程语言
  database: string   // 数据库类型
}

/**
 * health 接口既用于健康检查，也用于固定三项技术栈展示。
 */
export interface HealthInfo {
  status: string     // 服务状态（UP/DOWN）
  timestamp: string  // 服务器时间戳
  techStack: TechStack
}
