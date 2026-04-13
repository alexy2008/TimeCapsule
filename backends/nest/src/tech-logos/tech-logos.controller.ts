/**
 * 技术栈图标控制器 — 提供 backend.svg / language.svg / database.svg 静态资源
 *
 * 使用白名单（ALLOWED_FILES）防止路径遍历攻击，
 * 仅允许三个预定义的 SVG 文件名。
 *
 * 注意：使用 @Res() 会绕过 NestJS 响应序列化，
 * 因为这里直接通过 express Response.sendFile() 发送文件。
 */
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { accessSync, constants } from 'node:fs';
import { join } from 'node:path';

const ALLOWED_FILES = new Set(['backend.svg', 'language.svg', 'database.svg']);

@Controller('tech-logos')
export class TechLogosController {
  @Get(':file')
  getLogo(@Param('file') file: string, @Res() response: Response) {
    if (!ALLOWED_FILES.has(file)) {
      throw new NotFoundException('Not Found');
    }

    const assetPath = join(process.cwd(), 'static', 'tech-logos', file);
    accessSync(assetPath, constants.R_OK);
    response.sendFile(assetPath);
  }
}
