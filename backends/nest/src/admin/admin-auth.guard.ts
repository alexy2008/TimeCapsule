/**
 * 管理员认证守卫 — 在路由处理函数执行前拦截请求，验证 JWT
 *
 * NestJS 的 CanActivate（守卫）是框架三大核心概念之一：
 * - 守卫：请求进来之前做权限判断（类似 Spring Boot 的 HandlerInterceptor.preHandle）
 * - 过滤器：异常发生后做统一处理（见 api-exception.filter.ts）
 * - 管道：请求参数校验和转换（ValidationPipe）
 *
 * 对应其他技术栈的鉴权方式：
 * - Spring Boot: HandlerInterceptor + @PreAuthorize
 * - FastAPI: Depends(get_current_admin)
 * - Gin: middleware.AdminAuth()
 * - Axum: AdminAuth 自定义 extractor（FromRequestParts）
 *
 * @UseGuards(AdminAuthGuard) 装饰器将此守卫挂载到具体路由上，
 * 比 Gin 的 router.Group + middleware 更细粒度。
 */
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
