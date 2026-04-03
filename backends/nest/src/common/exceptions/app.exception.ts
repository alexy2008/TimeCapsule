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
