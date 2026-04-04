import { readBody } from 'h3'
import { createAdminToken, isValidAdminPassword } from '../../../utils/auth'
import { failure, success } from '../../../utils/http'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const password = typeof body.password === 'string' ? body.password : ''

  if (!password) {
    return failure(event, 400, '管理员密码不能为空', 'VALIDATION_ERROR')
  }
  if (!isValidAdminPassword(password)) {
    return failure(event, 401, '管理员密码错误', 'INVALID_CREDENTIALS')
  }

  return success({ token: await createAdminToken() }, '登录成功')
})
