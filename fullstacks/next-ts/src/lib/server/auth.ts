import { jwtVerify, SignJWT } from 'jose'
import { ADMIN_PASSWORD, JWT_EXPIRES_IN, JWT_SECRET } from './config'

const secret = new TextEncoder().encode(JWT_SECRET)
export const ADMIN_COOKIE_NAME = 'admin_token'

export async function createAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

export function isValidAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  if (payload.role !== 'admin') {
    throw new Error('无效管理员令牌')
  }
  return payload
}

export function getAdminTokenFromCookieStore(cookieStore: { get(name: string): { value: string } | undefined }) {
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value || null
}

export function getAdminTokenFromRequest(request: Request) {
  const header = request.headers.get('authorization') || ''
  if (header.startsWith('Bearer ')) {
    return header.slice(7)
  }

  const cookieHeader = request.headers.get('cookie') || ''
  for (const segment of cookieHeader.split(';')) {
    const [rawKey, ...rest] = segment.trim().split('=')
    if (rawKey === ADMIN_COOKIE_NAME) {
      return decodeURIComponent(rest.join('='))
    }
  }

  return null
}
