import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { error } from '../dto/api-response.dto';
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
