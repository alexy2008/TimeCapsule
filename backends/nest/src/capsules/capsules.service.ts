import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { AppBadRequestException } from '../common/exceptions/bad-request.exception';
import { CapsuleNotFoundException } from '../common/exceptions/capsule-not-found.exception';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { CapsuleCreatedDto, CapsuleDetailDto, CapsulePageDto } from './dto/capsule.dto';

interface CapsuleRow {
  id: number;
  code: string;
  title: string;
  content: string;
  creator: string;
  open_at: string;
  created_at: string;
}

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 8;
const MAX_RETRIES = 10;

function formatUtc(date: Date): string {
  return new Date(date.toISOString().slice(0, 19) + 'Z').toISOString().slice(0, 19) + 'Z';
}

function parseUtc(value: string): Date {
  const normalized = value.trim().replace(' ', 'T');
  return new Date(/[zZ]$|[+-]\d{2}:\d{2}$/.test(normalized) ? normalized : `${normalized}Z`);
}

@Injectable()
export class CapsulesService {
  constructor(private readonly databaseService: DatabaseService) {}

  createCapsule(request: CreateCapsuleDto): CapsuleCreatedDto {
    const openAt = parseUtc(request.openAt);
    const now = new Date(Date.now());

    if (Number.isNaN(openAt.getTime())) {
      throw new AppBadRequestException('开启时间必须是 ISO 8601 格式');
    }
    if (openAt.getTime() < now.getTime()) {
      throw new AppBadRequestException('开启时间必须在未来');
    }

    const code = this.generateUniqueCode();
    const createdAt = formatUtc(now);
    const openAtFormatted = formatUtc(openAt);

    this.databaseService
      .prepare(
        `INSERT INTO capsules (code, title, content, creator, open_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(code, request.title, request.content, request.creator, openAtFormatted, createdAt);

    return {
      code,
      title: request.title,
      creator: request.creator,
      openAt: openAtFormatted,
      createdAt,
    };
  }

  getCapsule(code: string): CapsuleDetailDto {
    const capsule = this.findByCode(code);
    if (!capsule) {
      throw new CapsuleNotFoundException(code);
    }
    return this.toDetailResponse(capsule, false);
  }

  listCapsules(page = 0, size = 20): CapsulePageDto {
    const countResult = this.databaseService
      .prepare('SELECT COUNT(*) as count FROM capsules')
      .get() as { count: number };
    const totalElements = countResult?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    const content = this.databaseService
      .prepare('SELECT * FROM capsules ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(size, page * size) as unknown as CapsuleRow[];

    return {
      content: content.map((capsule) => this.toDetailResponse(capsule, true)),
      totalElements,
      totalPages,
      number: page,
      size,
    };
  }

  deleteCapsule(code: string): void {
    const result = this.databaseService.prepare('DELETE FROM capsules WHERE code = ?').run(code);
    if (result.changes === 0) {
      throw new CapsuleNotFoundException(code);
    }
  }

  private findByCode(code: string): CapsuleRow | undefined {
    return this.databaseService
      .prepare('SELECT * FROM capsules WHERE code = ?')
      .get(code) as CapsuleRow | undefined;
  }

  private generateUniqueCode(): string {
    for (let i = 0; i < MAX_RETRIES; i += 1) {
      const code = this.generateCode();
      if (!this.findByCode(code)) {
        return code;
      }
    }
    throw new Error('无法生成唯一的胶囊码');
  }

  private generateCode(): string {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      code += CODE_CHARS[randomInt(CODE_CHARS.length)];
    }
    return code;
  }

  private toDetailResponse(capsule: CapsuleRow, includeContent: boolean): CapsuleDetailDto {
    const openAt = parseUtc(capsule.open_at);
    const opened = Date.now() > openAt.getTime();

    return {
      code: capsule.code,
      title: capsule.title,
      content: includeContent || opened ? capsule.content : null,
      creator: capsule.creator,
      openAt: formatUtc(openAt),
      createdAt: formatUtc(parseUtc(capsule.created_at)),
      opened,
    };
  }
}
