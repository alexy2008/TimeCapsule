/**
 * 全局异常过滤器 — 统一将各类异常转为标准响应格式
 *
 * NestJS 的 ExceptionFilter 在异常抛出后执行，
 * 位于请求生命周期的最后阶段。@Catch() 无参表示捕获所有异常。
 *
 * 分层处理策略（按优先级）：
 * 1. AppException — 业务异常，自带 errorCode
 * 2. BadRequestException — class-validator 校验失败
 * 3. HttpException — 其他 NestJS 内置 HTTP 异常
 * 4. 未知异常 — 返回通用 500，同时 console.error 记录
 *
 * 对应其他技术栈：
 * - Spring Boot: @ControllerAdvice + @ExceptionHandler
 * - FastAPI: app.add_exception_handler()
 * - Gin: middleware recover + 自定义错误响应
 */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
/**
 * 全局异常过滤器 — 统一将各类异常转为标准响应格式
 *
 * NestJS 的 ExceptionFilter 在异常抛出后执行，
 * 位于请求生命周期的最后阶段。@Catch() 无参表示捕获所有异常。
 *
 * 分层处理策略（按优先级）：
 * 1. AppException — 业务异常，自带 errorCode
 * 2. BadRequestException — class-validator 校验失败
 * 3. HttpException — 其他 NestJS 内置 HTTP 异常
 * 4. 未知异常 — 返回通用 500，同时 console.error 记录
 *
 * 对应其他技术栈：
 * - Spring Boot: @ControllerAdvice + @ExceptionHandler
 * - FastAPI: app.add_exception_handler()
 * - Gin: middleware recover + 自定义错误响应
 */
import { Response } from 'express';
/**
 * 全局异常过滤器 — 统一将各类异常转为标准响应格式
 *
 * NestJS 的 ExceptionFilter 在异常抛出后执行，
 * 位于请求生命周期的最后阶段。@Catch() 无参表示捕获所有异常。
 *
 * 分层处理策略（按优先级）：
 * 1. AppException — 业务异常，自带 errorCode
 * 2. BadRequestException — class-validator 校验失败
 * 3. HttpException — 其他 NestJS 内置 HTTP 异常
 * 4. 未知异常 — 返回通用 500，同时 console.error 记录
 *
 * 对应其他技术栈：
 * - Spring Boot: @ControllerAdvice + @ExceptionHandler
 * - FastAPI: app.add_exception_handler()
 * - Gin: middleware recover + 自定义错误响应
 */
import { error } from '../dto/api-response.dto';
/**
 * 全局异常过滤器 — 统一将各类异常转为标准响应格式
 *
 * NestJS 的 ExceptionFilter 在异常抛出后执行，
 * 位于请求生命周期的最后阶段。@Catch() 无参表示捕获所有异常。
 *
 * 分层处理策略（按优先级）：
 * 1. AppException — 业务异常，自带 errorCode
 * 2. BadRequestException — class-validator 校验失败
 * 3. HttpException — 其他 NestJS 内置 HTTP 异常
 * 4. 未知异常 — 返回通用 500，同时 console.error 记录
 *
 * 对应其他技术栈：
 * - Spring Boot: @ControllerAdvice + @ExceptionHandler
 * - FastAPI: app.add_exception_handler()
 * - Gin: middleware recover + 自定义错误响应
 */
import { AppException } from '../exceptions/app.exception';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof AppException) {
      response.status(exception.getStatus()).json(error(exception.message, exception.errorCode));
      return;
    }

    if (exception instanceof BadRequestException) {
      const payload = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };
      const message =
        typeof payload === 'string'
          ? payload
          : Array.isArray(payload.message)
            ? payload.message.join('; ')
            : payload.message ?? exception.message;
      response.status(HttpStatus.BAD_REQUEST).json(error(message, 'VALIDATION_ERROR'));
      return;
    }

    if (exception instanceof HttpException) {
      response
        .status(exception.getStatus())
        .json(error(exception.message || '请求失败', 'HTTP_ERROR'));
      return;
    }

    console.error('Unhandled exception:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error('服务器内部错误', 'INTERNAL_ERROR'));
  }
}
