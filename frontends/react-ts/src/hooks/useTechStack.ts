import { useEffect, useSyncExternalStore } from 'react'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

interface UseTechStackResult {
  techStack: TechStack | null
  loading: boolean
  error: boolean
}

type Snapshot = UseTechStackResult

let snapshot: Snapshot = {
  techStack: null,
  loading: true,
  error: false,
}
let inFlight: Promise<void> | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(listener => listener())
}

function setSnapshot(next: Snapshot) {
  snapshot = next
  emit()
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot(): Snapshot {
  return snapshot
}

function loadTechStack() {
  if (inFlight || (!snapshot.loading && (snapshot.techStack !== null || snapshot.error))) {
    return
  }

  inFlight = getHealthInfo()
    .then(response => {
      setSnapshot({
        techStack: response.data.techStack,
        loading: false,
        error: false,
      })
    })
    .catch(() => {
      setSnapshot({
        techStack: null,
        loading: false,
        error: true,
      })
    })
    .finally(() => {
      inFlight = null
    })
}

export function __resetTechStackForTests() {
  snapshot = {
    techStack: null,
    loading: true,
    error: false,
  }
  inFlight = null
  listeners.clear()
}

export function useTechStack(): UseTechStackResult {
  const current = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    loadTechStack()
  }, [])

  return current
}
