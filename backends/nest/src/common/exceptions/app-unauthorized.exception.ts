import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class AppUnauthorizedException extends AppException {
  constructor(message = '认证失败') {
    super('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
  }
}
