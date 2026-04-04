import { removeCapsuleByCode } from '@/lib/server/capsules'
import { getAdminTokenFromRequest, verifyAdminToken } from '@/lib/server/auth'
import { failure, success } from '@/lib/server/http'
import { normalizeCapsuleCode, validateCode } from '@/lib/server/validation'

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ code: string }>
}

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

export async function DELETE(request: Request, { params }: Props) {
  const authError = await ensureAuthorized(request)
  if (authError) {
    return failure(authError, 'UNAUTHORIZED', 401)
  }

  const { code } = await params
  const normalizedCode = normalizeCapsuleCode(code)

  if (!validateCode(normalizedCode)) {
    return failure('胶囊码格式无效', 'INVALID_CODE', 400)
  }

  const removed = removeCapsuleByCode(normalizedCode)
  if (!removed) {
    return failure('胶囊不存在', 'CAPSULE_NOT_FOUND', 404)
  }

  return success(null, '删除成功')
}
