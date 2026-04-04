import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { buildPageMetadata } from '@/lib/metadata'
import { listCapsules } from '@/lib/server/capsules'
import { getAdminTokenFromCookieStore, verifyAdminToken } from '@/lib/server/auth'
import AdminClient from './AdminClient'

export const metadata: Metadata = buildPageMetadata('管理后台', '管理员登录后查看和删除时间胶囊')

export default async function Page() {
  const cookieStore = await cookies()
  const token = getAdminTokenFromCookieStore(cookieStore)

  if (!token) {
    return <AdminClient />
  }

  try {
    await verifyAdminToken(token)
    const pageData = listCapsules(0, 20)
    return <AdminClient initialLoggedIn initialPageData={pageData} />
  } catch {
    return <AdminClient />
  }
}
