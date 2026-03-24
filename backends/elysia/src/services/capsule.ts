/**
 * 胶囊业务逻辑
 * 封装创建、查询、列表、删除等核心操作
 */
import { CapsuleModel, CapsuleRow } from "../database";
import type { CreateCapsuleRequestType, CapsuleDetailType, CapsulePageType } from "../schemas";

// Base62 字符集：A-Za-z0-9 (62 chars)
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 8;
const MAX_RETRIES = 10;

/**
 * 自定义错误
 */
export class CapsuleNotFoundError extends Error {
  constructor(public code: string) {
    super(`胶囊不存在：${code}`);
    this.name = "CapsuleNotFoundError";
  }
}

export class InvalidOpenAtError extends Error {
  constructor(message: string = "开启时间必须在未来") {
    super(message);
    this.name = "InvalidOpenAtError";
  }
}

export class CodeGenerationError extends Error {
  constructor(message: string = "无法生成唯一的胶囊码") {
    super(message);
    this.name = "CodeGenerationError";
  }
}

/**
 * 生成 8 位 base62 随机码
 */
function generateCode(): string {
  let result = "";
  const charsLength = CODE_CHARS.length;
  const array = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(array);
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CODE_CHARS[array[i] % charsLength];
  }
  return result;
}

/**
 * 生成唯一的胶囊码，最多重试 MAX_RETRIES 次
 */
function generateUniqueCode(): string {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const code = generateCode();
    if (!CapsuleModel.codeExists(code)) {
      return code;
    }
  }
  throw new CodeGenerationError();
}

/**
 * 格式化时间为 ISO 8601 字符串 (Z 结尾)
 */
function formatTimeISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

/**
 * 解析 ISO 8601 时间字符串
 */
function parseISOTime(isoString: string): Date {
  let normalized = isoString.trim().replace(" ", "T");
  if (!/[zZ]$|[+-]\d{2}:\d{2}$/.test(normalized)) {
    normalized += "Z";
  }
  return new Date(normalized);
}

/**
 * 将 Capsule 实体转换为响应对象
 */
function toResponse(capsule: CapsuleRow, includeContent: boolean = false): CapsuleDetailType {
  const now = new Date();
  const openAt = parseISOTime(capsule.open_at);
  const createdAt = parseISOTime(capsule.created_at);
  const opened = now > openAt;

  return {
    code: capsule.code,
    title: capsule.title,
    content: includeContent ? capsule.content : (opened ? capsule.content : null),
    creator: capsule.creator,
    openAt: formatTimeISO(openAt),
    createdAt: formatTimeISO(createdAt),
    opened,
  };
}

/**
 * 创建时间胶囊
 */
export function createCapsule(request: CreateCapsuleRequestType): CapsuleDetailType {
  const now = new Date();
  const openAt = parseISOTime(request.openAt);

  // openAt 必须在未来
  if (openAt <= now) {
    throw new InvalidOpenAtError();
  }

  const code = generateUniqueCode();

  const capsule = CapsuleModel.create({
    code,
    title: request.title,
    content: request.content,
    creator: request.creator,
    open_at: formatTimeISO(openAt),
    created_at: formatTimeISO(now),
  });

  // 返回响应（创建时不返回 content 和 opened）
  return {
    code: capsule.code,
    title: capsule.title,
    content: null,
    creator: capsule.creator,
    openAt: capsule.open_at,
    createdAt: capsule.created_at,
    opened: false,
  };
}

/**
 * 查询胶囊详情
 */
export function getCapsule(code: string): CapsuleDetailType {
  const capsule = CapsuleModel.findByCode(code);
  if (!capsule) {
    throw new CapsuleNotFoundError(code);
  }
  return toResponse(capsule, false);
}

/**
 * 分页查询胶囊列表（管理员用）
 */
export function listCapsules(page: number = 0, size: number = 20): CapsulePageType {
  const { content, total } = CapsuleModel.findAll(page, size);
  const totalPages = Math.max(1, Math.ceil(total / size));

  return {
    content: content.map((c) => toResponse(c, true)),
    totalElements: total,
    totalPages,
    number: page,
    size,
  };
}

/**
 * 删除胶囊
 */
export function deleteCapsule(code: string): void {
  const deleted = CapsuleModel.deleteByCode(code);
  if (!deleted) {
    throw new CapsuleNotFoundError(code);
  }
}
