import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppUnauthorizedException } from '../common/exceptions/app-unauthorized.exception';
import { AdminService } from './admin.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.header('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppUnauthorizedException('缺少认证令牌');
    }

    const token = authorization.slice(7);
    if (!this.adminService.validateToken(token)) {
      throw new AppUnauthorizedException('认证令牌无效或已过期');
    }

    return true;
  }
}
