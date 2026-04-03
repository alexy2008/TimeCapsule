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
import { ok } from '../common/dto/api-response.dto';
import { AppUnauthorizedException } from '../common/exceptions/app-unauthorized.exception';
import { CapsulesService } from '../capsules/capsules.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
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
