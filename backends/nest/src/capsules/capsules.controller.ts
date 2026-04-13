/**
 * 胶囊控制器 — 处理 /capsules 路由
 *
 * 对应其他技术栈：
 * - Spring Boot: CapsuleController
 * - FastAPI: capsule_router
 * - Gin: handler.CapsuleHandler
 *
 * NestJS 控制器通过装饰器声明路由，比 Gin 的手动注册更声明式。
 */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ok } from '../common/dto/api-response.dto';
import { CapsulesService } from './capsules.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';

@Controller('capsules')
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() request: CreateCapsuleDto) {
    return ok(this.capsulesService.createCapsule(request), '胶囊创建成功');
  }

  @Get(':code')
  get(@Param('code') code: string) {
    return ok(this.capsulesService.getCapsule(code));
  }
}
