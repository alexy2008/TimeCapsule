import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/metadata'
import OpenPageClient from './OpenPageClient'

export const metadata: Metadata = buildPageMetadata('开启胶囊', '输入胶囊码并查看时间胶囊的当前状态')

export default function Page() {
  return <OpenPageClient />
}
