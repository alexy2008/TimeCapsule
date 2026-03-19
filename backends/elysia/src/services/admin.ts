/**
 * 管理员认证服务
 * JWT 令牌的生成与验证
 */
import { SignJWT, jwtVerify } from "jose";
import { ADMIN_PASSWORD, JWT_SECRET, JWT_EXPIRATION_HOURS } from "../config";

/**
 * 自定义错误
 */
export class UnauthorizedError extends Error {
  constructor(message: string = "认证失败") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// 将密钥转换为 Uint8Array
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * 管理员登录
 * 密码正确返回 JWT token，否则抛出 UnauthorizedError
 */
export async function login(password: string): Promise<string> {
  if (password !== ADMIN_PASSWORD) {
    throw new UnauthorizedError("密码错误");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "admin",
    iat: now,
    exp: now + JWT_EXPIRATION_HOURS * 60 * 60,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKey);

  return token;
}

/**
 * 验证 JWT 令牌
 * 返回是否有效
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从 Authorization header 提取并验证 token
 * 成功返回 void，失败抛出 UnauthorizedError
 */
export async function verifyAuth(authorization: string | undefined): Promise<void> {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("缺少认证令牌");
  }

  const token = authorization.slice(7); // 去掉 "Bearer " 前缀

  const valid = await validateToken(token);
  if (!valid) {
    throw new UnauthorizedError("认证令牌无效或已过期");
  }
}
