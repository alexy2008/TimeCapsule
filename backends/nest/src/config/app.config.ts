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
