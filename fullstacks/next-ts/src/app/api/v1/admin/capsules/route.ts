import { listCapsules } from '@/lib/server/capsules'
import { getAdminTokenFromRequest, verifyAdminToken } from '@/lib/server/auth'
import { failure, success } from '@/lib/server/http'

export const runtime = 'nodejs'

async function ensureAuthorized(request: Request) {
  const token = getAdminTokenFromRequest(request)
  if (!token) {
    return '缺少管理员令牌'
  }

  try {
    await verifyAdminToken(token)
    return null
  } catch {
    return '管理员认证已失效'
  }
}

export async function GET(request: Request) {
  const authError = await ensureAuthorized(request)
  if (authError) {
    return failure(authError, 'UNAUTHORIZED', 401)
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get('page') || '0', 10)
  const size = Number.parseInt(searchParams.get('size') || '20', 10)

  return success(listCapsules(Number.isNaN(page) ? 0 : page, Number.isNaN(size) ? 20 : size))
}
