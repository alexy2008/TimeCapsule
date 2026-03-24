import { useEffect, useState } from 'react'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

interface UseTechStackResult {
  techStack: TechStack | null
  loading: boolean
  error: boolean
}

export function useTechStack(): UseTechStackResult {
  const [techStack, setTechStack] = useState<TechStack | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    getHealthInfo()
      .then(response => {
        if (!active) {
          return
        }

        setTechStack(response.data.techStack)
        setError(false)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setTechStack(null)
        setError(true)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  return { techStack, loading, error }
}
