import { getRouterParam } from 'h3'
import { findCapsuleByCode } from '../../../utils/capsules'
import { failure, success } from '../../../utils/http'
import { validateCode } from '../../../utils/validation'

export default defineEventHandler((event) => {
  const code = (getRouterParam(event, 'code') || '').toUpperCase()
  if (!validateCode(code)) {
    return failure(event, 400, '胶囊码格式无效', 'INVALID_CODE')
  }

  const capsule = findCapsuleByCode(code)
  if (!capsule) {
    return failure(event, 404, '胶囊不存在', 'CAPSULE_NOT_FOUND')
  }

  return success(capsule)
})
