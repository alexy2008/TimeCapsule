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
