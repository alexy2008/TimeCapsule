/**
 * 胶囊业务逻辑层 — 胶囊的创建、查询、列表、删除
 *
 * 对应其他技术栈的 Service 层：
 * - Spring Boot: CapsuleService
 * - FastAPI: capsule_service
 * - Gin: service.CapsuleService
 * - Axum: handler 函数内联逻辑
 *
 * NestJS 的 @Injectable 依赖注入类似 Spring 的 @Service，
 * 构造器注入 DatabaseService 实现数据库访问。
 */
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

// 将 Date 格式化为去除毫秒的 UTC ISO 8601 字符串
// 注意：此函数做了两次截断重建，实际等价于 date.toISOString()，未来可简化
function formatUtc(date: Date): string {
  return new Date(date.toISOString().slice(0, 19) + 'Z').toISOString().slice(0, 19) + 'Z';
}

// 解析 ISO 8601 时间字符串为 Date 对象
// 容忍空格分隔（"2025-01-01 12:00:00Z"），缺少时区后缀时默认补 Z（UTC）
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

  // 生成唯一的 8 位大写字母+数字 code，最多重试 10 次避免碰撞
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

  /**
   * 将数据库行转换为详情响应
   *
   * 内容可见性策略：
   * - 管理员（includeContent=true）始终看到 content
   * - 普通访客在 openAt 之前看不到 content（返回 null）
   * - 开启时间到达后，所有人都能看到 content
   */
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
