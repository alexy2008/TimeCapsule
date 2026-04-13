// 404 胶囊不存在异常 — 查询或删除时 code 未匹配到记录
import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class CapsuleNotFoundException extends AppException {
  constructor(code: string) {
    super('CAPSULE_NOT_FOUND', `胶囊不存在：${code}`, HttpStatus.NOT_FOUND);
  }
}
