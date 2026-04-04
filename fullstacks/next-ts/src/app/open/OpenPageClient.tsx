'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCapsule } from '@/api'
import CapsuleCard from '@/components/CapsuleCard'
import CapsuleCodeInput from '@/components/CapsuleCodeInput'
import type { Capsule } from '@/types'

interface Props {
  routeCode?: string
  initialCapsule?: Capsule | null
  initialError?: string | null
}

export default function OpenPageClient({ routeCode, initialCapsule = null, initialError = null }: Props) {
  const router = useRouter()
  const [capsule, setCapsule] = useState<Capsule | null>(initialCapsule)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [code, setCode] = useState(routeCode || '')

  useEffect(() => {
    setCode(routeCode || '')
    setCapsule(initialCapsule)
    setError(initialError)
  }, [routeCode, initialCapsule, initialError])

  function clearState() {
    setCapsule(null)
    setError(null)
  }

  function handleQuery(nextCode: string) {
    router.push(`/open/${nextCode}`)
  }

  async function handleExpired() {
    const currentCode = capsule?.code || code
    if (!currentCode) return

    setLoading(true)
    setError(null)
    try {
      const response = await getCapsule(currentCode)
      setCapsule(response.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '查询失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="view-search" className="view active">
      <div className="view-header">
        <button
          className="btn-back"
          onClick={() => {
            if (capsule) {
              clearState()
              router.push('/open')
            } else {
              router.push('/')
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>{capsule ? (capsule.opened ? '状态: 已解锁' : '状态: 锁定中') : '打开时间胶囊'}</h2>
      </div>

      {!capsule ? (
        <CapsuleCodeInput
          value={code}
          onChange={setCode}
          onSubmit={handleQuery}
          loading={loading}
          error={error}
        />
      ) : (
        <CapsuleCard capsule={capsule} onExpired={handleExpired} />
      )}
    </section>
  )
}
