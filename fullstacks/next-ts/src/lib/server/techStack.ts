import { cache } from 'react'
import type { TechStack } from '@/types'
import { BACKEND_TECH_STACK } from './app-info'

export const getServerTechStack = cache(async (): Promise<TechStack> => BACKEND_TECH_STACK)

export function buildServerTechLogoUrl(kind: 'backend' | 'language' | 'database', techStack: TechStack | null): string {
  const base = `/tech-logos/${kind}.svg`

  if (!techStack) {
    return base
  }

  const versionKey =
    kind === 'backend'
      ? techStack.framework
      : kind === 'language'
        ? techStack.language
        : techStack.database

  return `${base}?v=${encodeURIComponent(versionKey)}`
}
