import { createMemo, createResource, createRoot, createSignal } from 'solid-js'
import { getHealthInfo } from '@/lib/api'

export function simplifyTechLabel(value: string) {
  return value.trim().replace(/\s+v?\d+(\.\d+)*.*$/i, '').trim()
}

const techStackStore = createRoot(() => {
  const [reloadSeed, setReloadSeed] = createSignal(0)
  const [health] = createResource(reloadSeed, async () => {
    const response = await getHealthInfo()
    return response.data.techStack
  })

  const techStack = createMemo(() => health() ?? null)
  const loading = createMemo(() => health.loading)
  const error = createMemo(() => Boolean(health.error))

  function reload() {
    setReloadSeed(value => value + 1)
  }

  function ensureLoaded() {
    if (loading() || techStack()) return
    reload()
  }

  return {
    techStack,
    loading,
    error,
    reload,
    ensureLoaded,
  }
})

export function useTechStack() {
  techStackStore.ensureLoaded()
  return techStackStore
}
