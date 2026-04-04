import { getHeader, getQuery } from 'h3'
import { listCapsules } from '../../../../utils/capsules'
import { verifyAdminToken } from '../../../../utils/auth'
import { failure, success } from '../../../../utils/http'

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

  const query = getQuery(event)
  const page = Number.parseInt(String(query.page || '0'), 10)
  const size = Number.parseInt(String(query.size || '20'), 10)

  return success(listCapsules(Number.isNaN(page) ? 0 : page, Number.isNaN(size) ? 20 : size))
})
