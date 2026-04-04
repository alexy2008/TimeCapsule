import { ADMIN_COOKIE_NAME, createAdminToken, isValidAdminPassword } from '@/lib/server/auth'
import { failure, success } from '@/lib/server/http'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return failure('请求体必须是有效的 JSON', 'INVALID_JSON', 400)
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!password) {
    return failure('管理员密码不能为空', 'VALIDATION_ERROR', 400)
  }

  if (!isValidAdminPassword(password)) {
    return failure('管理员密码错误', 'INVALID_CREDENTIALS', 401)
  }

  const token = await createAdminToken()
  const response = success({ token }, '登录成功')
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 2,
  })
  return response
}
