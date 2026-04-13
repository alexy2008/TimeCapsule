// 400 请求参数异常 — 时间格式错误、开启时间在过去等业务校验失败
import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class AppBadRequestException extends AppException {
  constructor(message: string) {
    super('BAD_REQUEST', message, HttpStatus.BAD_REQUEST);
  }
}
