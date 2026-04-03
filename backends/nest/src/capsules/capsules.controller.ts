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
