/**
 * Schema 定义
 * 使用 Elysia 内置的 TypeBox 进行数据验证
 */
import { t } from "elysia";

// ========== 请求 Schema ==========

/**
 * 创建胶囊请求
 */
export const CreateCapsuleRequest = t.Object({
  title: t.String({ minLength: 1, maxLength: 100 }),
  content: t.String({ minLength: 1 }),
  creator: t.String({ minLength: 1, maxLength: 30 }),
  openAt: t.String({ format: "date-time" }),
});

/**
 * 管理员登录请求
 */
export const AdminLoginRequest = t.Object({
  password: t.String({ minLength: 1 }),
});

// ========== 响应 Schema ==========

/**
 * 胶囊响应（创建后）
 */
export const CapsuleCreated = t.Object({
  code: t.String(),
  title: t.String(),
  creator: t.String(),
  openAt: t.String(),
  createdAt: t.String(),
});

/**
 * 胶囊详情响应
 */
export const CapsuleDetail = t.Object({
  code: t.String(),
  title: t.String(),
  content: t.Union([t.String(), t.Null()]),
  creator: t.String(),
  openAt: t.String(),
  createdAt: t.String(),
  opened: t.Boolean(),
});

/**
 * 分页响应
 */
export const CapsulePage = t.Object({
  content: t.Array(CapsuleDetail),
  totalElements: t.Number(),
  totalPages: t.Number(),
  number: t.Number(),
  size: t.Number(),
});

/**
 * 管理员 Token 响应
 */
export const AdminToken = t.Object({
  token: t.String(),
});

/**
 * 技术栈信息
 */
export const TechStack = t.Object({
  framework: t.String(),
  language: t.String(),
  database: t.String(),
});

/**
 * 健康检查数据
 */
export const HealthData = t.Object({
  status: t.String(),
  timestamp: t.String(),
  techStack: TechStack,
});

// ========== 统一响应格式 ==========

/**
 * 统一 API 响应
 */
export const ApiResponse = <T extends ReturnType<typeof t.Object>>(dataSchema: T) =>
  t.Object({
    success: t.Boolean(),
    data: t.Union([dataSchema, t.Null()]),
    message: t.Union([t.String(), t.Null()]),
    errorCode: t.Union([t.String(), t.Null()]),
  });

/**
 * 空数据响应
 */
export const VoidResponse = t.Object({
  success: t.Boolean(),
  data: t.Union([t.Object({}), t.Null()]),
  message: t.Union([t.String(), t.Null()]),
  errorCode: t.Union([t.String(), t.Null()]),
});

/**
 * 错误响应
 */
export const ErrorResponse = t.Object({
  success: t.Literal(false),
  data: t.Union([t.Object({}), t.Null()]),
  message: t.String(),
  errorCode: t.String(),
});

// ========== 类型导出 ==========

export type CreateCapsuleRequestType = typeof CreateCapsuleRequest.static;
export type AdminLoginRequestType = typeof AdminLoginRequest.static;
export type CapsuleCreatedType = typeof CapsuleCreated.static;
export type CapsuleDetailType = typeof CapsuleDetail.static;
export type CapsulePageType = typeof CapsulePage.static;
export type AdminTokenType = typeof AdminToken.static;
