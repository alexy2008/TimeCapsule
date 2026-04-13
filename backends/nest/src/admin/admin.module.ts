/**
 * 管理模块 — 注册 JwtModule、AdminService、AdminAuthGuard
 *
 * 导入 CapsulesModule 以复用 CapsulesService（列表和删除功能），
 * JwtModule.register() 配置 JWT 密钥和过期时间。
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CapsulesModule } from '../capsules/capsules.module';
import { appConfig } from '../config/app.config';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    CapsulesModule,
    JwtModule.register({
      secret: appConfig.jwtSecret,
      signOptions: {
        expiresIn: `${appConfig.jwtExpirationHours}h`,
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard],
})
export class AdminModule {}
