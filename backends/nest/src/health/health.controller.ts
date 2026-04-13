/**
 * 健康检查控制器 — 所有 9 个后端共享同一健康检查契约
 *
 * 返回 { status, timestamp, techStack: { framework, language, database } }
 * 前端和验证脚本通过此端点确认后端存活和技术栈标识。
 */
import { Controller, Get } from '@nestjs/common';
import { ok } from '../common/dto/api-response.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return ok(this.healthService.getHealth());
  }
}
