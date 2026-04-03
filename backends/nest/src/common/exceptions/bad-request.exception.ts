import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class AppBadRequestException extends AppException {
  constructor(message: string) {
    super('BAD_REQUEST', message, HttpStatus.BAD_REQUEST);
  }
}
