import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/metadata'
import { findCapsuleByCode } from '@/lib/server/capsules'
import { normalizeCapsuleCode, safeDecodeURIComponent, validateCode } from '@/lib/server/validation'
import OpenPageClient from '../OpenPageClient'

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  return buildPageMetadata(`开启胶囊 ${safeDecodeURIComponent(code)}`, '查看指定胶囊码对应的时间胶囊状态')
}

export default async function Page({ params }: Props) {
  const { code } = await params
  const decodedCode = safeDecodeURIComponent(code)
  const normalizedCode = normalizeCapsuleCode(code)

  if (!validateCode(normalizedCode)) {
    return <OpenPageClient routeCode={decodedCode} initialError="胶囊码格式无效" />
  }

  const capsule = findCapsuleByCode(normalizedCode)
  if (!capsule) {
    return <OpenPageClient routeCode={decodedCode} initialError="胶囊不存在" />
  }

  return <OpenPageClient routeCode={decodedCode} initialCapsule={capsule} />
}
