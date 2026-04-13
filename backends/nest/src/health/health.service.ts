// 健康检查服务 — 返回框架、语言、数据库信息
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      techStack: {
        framework: 'NestJS 11',
        language: 'TypeScript 5',
        database: 'SQLite',
      },
    };
  }
}
