/**
 * 统一响应体结构 — 所有 9 个后端实现共用此格式
 *
 * 为什么统一使用 { success, data, message, errorCode } 结构：
 * - 前端只需判断 success 即可区分成功/失败
 * - data 可以是任意类型（泛型 T），类型安全
 * - errorCode 字符串让前端可以做国际化错误提示
 */
export interface ApiResponseDto<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errorCode: string | null;
}

export function ok<T>(data: T, message: string | null = null): ApiResponseDto<T> {
  return {
    success: true,
    data,
    message,
    errorCode: null,
  };
}

export function error(message: string, errorCode: string): ApiResponseDto<null> {
  return {
    success: false,
    data: null,
    message,
    errorCode,
  };
}
