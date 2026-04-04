import { findCapsuleByCode } from '@/lib/server/capsules'
import { failure, success } from '@/lib/server/http'
import { normalizeCapsuleCode, validateCode } from '@/lib/server/validation'

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ code: string }>
}

export async function GET(_: Request, { params }: Props) {
  const { code } = await params
  const normalizedCode = normalizeCapsuleCode(code)

  if (!validateCode(normalizedCode)) {
    return failure('胶囊码格式无效', 'INVALID_CODE', 400)
  }

  const capsule = findCapsuleByCode(normalizedCode)
  if (!capsule) {
    return failure('胶囊不存在', 'CAPSULE_NOT_FOUND', 404)
  }

  return success(capsule)
}
