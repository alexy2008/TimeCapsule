import { ADMIN_COOKIE_NAME } from '@/lib/server/auth'
import { success } from '@/lib/server/http'

export const runtime = 'nodejs'

export async function POST() {
  const response = success(null, '退出成功')
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
