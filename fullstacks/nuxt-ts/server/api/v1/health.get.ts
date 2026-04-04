import { BACKEND_TECH_STACK } from '../../utils/app-info'
import { success } from '../../utils/http'

export default defineEventHandler(() => {
  return success({
    status: 'UP',
    timestamp: new Date().toISOString(),
    techStack: BACKEND_TECH_STACK,
  })
})
