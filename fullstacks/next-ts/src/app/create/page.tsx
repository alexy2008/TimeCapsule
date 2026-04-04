import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/metadata'
import CreateClient from './CreateClient'

export const metadata: Metadata = buildPageMetadata('创建胶囊', '创建并封存一枚未来开启的时间胶囊')

export default function Page() {
  return <CreateClient />
}
