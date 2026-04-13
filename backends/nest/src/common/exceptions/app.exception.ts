/**
 * 业务异常基类 — 所有自定义异常继承此类
 *
 * 扩展 NestJS 内置 HttpException，额外携带 errorCode 字符串，
 * 让全局异常过滤器可以统一提取错误码和消息。
 *
 * 异常层级：
 * HttpException (NestJS 内置)
 * └── AppException (errorCode + message)
 *     ├── AppBadRequestException (400)
 *     ├── AppUnauthorizedException (401)
 *     └── CapsuleNotFoundException (404)
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    readonly errorCode: string,
    message: string,
    status: HttpStatus,
  ) {
    super(message, status);
  }
}
