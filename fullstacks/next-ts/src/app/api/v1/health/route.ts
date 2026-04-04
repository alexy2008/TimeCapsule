import { success } from '@/lib/server/http'
import { BACKEND_TECH_STACK } from '@/lib/server/app-info'

export const runtime = 'nodejs'

export async function GET() {
  return success({
    status: 'UP',
    timestamp: new Date().toISOString(),
    techStack: BACKEND_TECH_STACK,
  })
}
