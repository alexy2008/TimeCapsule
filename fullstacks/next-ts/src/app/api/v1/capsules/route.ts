import { insertCapsule } from '@/lib/server/capsules'
import { failure, success } from '@/lib/server/http'
import { validateCreateCapsuleInput } from '@/lib/server/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return failure('请求体必须是有效的 JSON', 'INVALID_JSON', 400)
  }

  const validated = validateCreateCapsuleInput(body)
  if ('error' in validated) {
    return failure(validated.error, 'VALIDATION_ERROR', 400)
  }

  try {
    const capsule = insertCapsule(validated.value)
    return success(capsule, '胶囊创建成功', { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '胶囊创建失败'
    return failure(message, 'CREATE_FAILED', 500)
  }
}
