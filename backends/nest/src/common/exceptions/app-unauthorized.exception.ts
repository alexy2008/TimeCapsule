// 401 未授权异常 — 密码错误或 JWT 无效/过期时抛出
import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class AppUnauthorizedException extends AppException {
  constructor(message = '认证失败') {
    super('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
  }
}
