import { jwtVerify, SignJWT } from 'jose'
import { ADMIN_PASSWORD, JWT_EXPIRES_IN, JWT_SECRET } from './config'

const secret = new TextEncoder().encode(JWT_SECRET)
export const ADMIN_COOKIE_NAME = 'admin_token'

export async function createAdminToken() {
  // Next 全栈实现使用 httpOnly cookie 保存管理员态，因此 token 本身只需携带最小角色信息。
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
  // 先读 Authorization，再回退到 cookie。
  // 这样同一套校验逻辑既能服务服务端页面，也能服务 API 调用。
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
