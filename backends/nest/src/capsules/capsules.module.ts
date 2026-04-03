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
