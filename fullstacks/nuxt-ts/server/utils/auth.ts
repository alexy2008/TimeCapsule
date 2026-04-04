import { jwtVerify, SignJWT } from 'jose'
import { ADMIN_PASSWORD, JWT_SECRET } from './config'

const secret = new TextEncoder().encode(JWT_SECRET)

export function isValidAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function createAdminToken() {
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
