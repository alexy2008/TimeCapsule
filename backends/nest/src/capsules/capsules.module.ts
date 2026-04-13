/**
 * 胶囊模块 — 注册 CapsulesController、CapsulesService、DatabaseService
 *
 * 导出 CapsulesService 和 DatabaseService 供 AdminModule 复用。
 * DatabaseService 在此模块中声明和初始化，确保 SQLite 连接单例。
 */
import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CapsulesController } from './capsules.controller';
import { CapsulesService } from './capsules.service';

@Module({
  controllers: [CapsulesController],
  providers: [CapsulesService, DatabaseService],
  exports: [CapsulesService, DatabaseService],
})
export class CapsulesModule {}
