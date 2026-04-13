/**
 * 应用配置 — 从环境变量读取，提供默认值
 *
 * 演示项目硬编码默认密码和 JWT 密钥，
 * 生产环境应通过环境变量覆盖（不使用 fallback）。
 *
 * 对应其他技术栈：
 * - Spring Boot: application.properties / @Value
 * - FastAPI: os.getenv / pydantic BaseSettings
 * - Gin: viper / os.Getenv
 */
import { resolve } from 'node:path';

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const appConfig = {
  port: readNumber('PORT', 18040),
  databasePath: resolve(
    process.cwd(),
    process.env.DATABASE_URL ??
      (process.env.NODE_ENV === 'test' ? './test/hellotime.test.db' : '../../data/hellotime.db'),
  ),
  adminPassword: process.env.ADMIN_PASSWORD ?? 'timecapsule-admin',
  jwtSecret:
    process.env.JWT_SECRET ?? 'hellotime-jwt-secret-key-that-is-long-enough-for-hs256',
  jwtExpirationHours: readNumber('JWT_EXPIRATION_HOURS', 2),
} as const;
