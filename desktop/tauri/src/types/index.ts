/**
 * 时间胶囊数据类型定义
 * 与后端 API 响应格式保持一致
 */

/**
 * 时间胶囊对象
 * 对应后端 CapsuleResponse DTO
 */
export interface Capsule {
  code: string           // 8 位胶囊码
  title: string          // 胶囊标题
  content?: string | null  // 胶囊内容（时间未到时为 null/undefined）
  creator: string        // 创建者昵称
  openAt: string         // 开启时间（ISO 8601 格式）
  createdAt: string      // 创建时间（ISO 8601 格式）
  opened?: boolean       // 是否已开启（时间已到）
}

/**
 * 创建胶囊表单数据类型
 * 用于表单输入和 API 请求
 */
export interface CreateCapsuleForm {
  title: string      // 标题（必填，最多 100 字符）
  content: string    // 内容（必填）
  creator: string    // 创建者（必填，最多 30 字符）
  openAt: string     // 开启时间（必填，ISO 日期格式）
}

/**
 * 统一 API 响应类型
 * 所有后端接口返回的统一格式
 */
export interface ApiResponse<T> {
  success: boolean   // 请求是否成功
  data: T            // 响应数据
  message?: string   // 响应消息
  errorCode?: string // 错误码（失败时）
}

/**
 * 分页数据类型
 * 用于分页列表展示
 */
export interface PageData<T> {
  content: T[]           // 当前页数据
  totalElements: number  // 总元素数
  totalPages: number     // 总页数
  number: number         // 当前页码（从 0 开始）
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
 * Health 接口响应类型
 */
export interface HealthInfo {
  status: string     // 服务状态（UP/DOWN）
  timestamp: string  // 服务器时间戳
  techStack: TechStack
}
