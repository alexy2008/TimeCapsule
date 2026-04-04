import { getHeader, getRouterParam } from 'h3'
import { removeCapsuleByCode } from '../../../../utils/capsules'
import { verifyAdminToken } from '../../../../utils/auth'
import { failure, success } from '../../../../utils/http'
import { validateCode } from '../../../../utils/validation'

async function ensureAuthorized(event: Parameters<typeof defineEventHandler>[0]) {
  const header = getHeader(event, 'authorization') || ''
  if (!header.startsWith('Bearer ')) return '缺少管理员令牌'

  try {
    await verifyAdminToken(header.slice(7))
    return null
  } catch {
    return '管理员认证已失效'
  }
}

export default defineEventHandler(async (event) => {
  const authError = await ensureAuthorized(event)
  if (authError) {
    return failure(event, 401, authError, 'UNAUTHORIZED')
  }

  const code = (getRouterParam(event, 'code') || '').toUpperCase()
  if (!validateCode(code)) {
    return failure(event, 400, '胶囊码格式无效', 'INVALID_CODE')
  }

  const removed = removeCapsuleByCode(code)
  if (!removed) {
    return failure(event, 404, '胶囊不存在', 'CAPSULE_NOT_FOUND')
  }

  return success(null, '删除成功')
})
