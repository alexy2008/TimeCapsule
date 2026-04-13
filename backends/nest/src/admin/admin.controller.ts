/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { ok } from '../common/dto/api-response.dto';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { AppUnauthorizedException } from '../common/exceptions/app-unauthorized.exception';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { CapsulesService } from '../capsules/capsules.service';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { AdminAuthGuard } from './admin-auth.guard';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { AdminService } from './admin.service';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { AdminLoginDto } from './dto/admin-login.dto';
/**
 * 管理控制器 — 处理 /admin 路由（登录、列表、删除）
 *
 * @UseGuards(AdminAuthGuard) 将守卫挂载到需要认证的路由上，
 * 比 Spring Boot 的 @PreAuthorize 更显式，比 Gin 的 router.Group 更细粒度。
 * 登录路由不需要守卫，其他两个路由都需要。
 */
import { ListCapsulesQueryDto } from './dto/list-capsules-query.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly capsulesService: CapsulesService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() request: AdminLoginDto) {
    const token = this.adminService.login(request.password);
    if (!token) {
      throw new AppUnauthorizedException('密码错误');
    }
    return ok({ token }, '登录成功');
  }

  @Get('capsules')
  @UseGuards(AdminAuthGuard)
  list(@Query() query: ListCapsulesQueryDto) {
    return ok(this.capsulesService.listCapsules(query.page, query.size));
  }

  @Delete('capsules/:code')
  @UseGuards(AdminAuthGuard)
  remove(@Param('code') code: string) {
    this.capsulesService.deleteCapsule(code);
    return ok(null, '删除成功');
  }
}
