import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CapsulesModule } from './capsules/capsules.module';
import { HealthModule } from './health/health.module';
import { TechLogosController } from './tech-logos/tech-logos.controller';

@Module({
  imports: [HealthModule, CapsulesModule, AdminModule],
  controllers: [TechLogosController],
})
export class AppModule {}
