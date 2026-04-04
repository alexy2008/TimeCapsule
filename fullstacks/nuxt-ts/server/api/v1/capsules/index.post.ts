import { readBody } from 'h3'
import { insertCapsule } from '../../../utils/capsules'
import { failure, success } from '../../../utils/http'
import { validateCreateCapsuleInput } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  let body: Record<string, unknown>

  try {
    // Nuxt server api 和 Next Route Handler 一样，先做协议层解析，再交给共享校验逻辑。
    body = await readBody(event)
  } catch {
    return failure(event, 400, '请求体必须是有效的 JSON', 'INVALID_JSON')
  }

  const validated = validateCreateCapsuleInput(body)
  if ('error' in validated) {
    return failure(event, 400, validated.error, 'VALIDATION_ERROR')
  }

  try {
    // 插入数据库的真正业务逻辑不写在 API 文件里，便于不同入口共用。
    return success(insertCapsule(validated.value), '胶囊创建成功')
  } catch (error) {
    return failure(event, 500, error instanceof Error ? error.message : '胶囊创建失败', 'CREATE_FAILED')
  }
})
