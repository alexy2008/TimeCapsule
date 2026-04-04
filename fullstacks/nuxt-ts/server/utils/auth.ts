import { jwtVerify, SignJWT } from 'jose'
import { ADMIN_PASSWORD, JWT_SECRET } from './config'

const secret = new TextEncoder().encode(JWT_SECRET)

export function isValidAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function createAdminToken() {
  // Nuxt 全栈实现与 Next 一样把管理员态收敛到 cookie，
  // 页面和 server api 都围绕同一份 token 工作。
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  if (payload.role !== 'admin') {
    throw new Error('无效管理员令牌')
  }
  return payload
}
