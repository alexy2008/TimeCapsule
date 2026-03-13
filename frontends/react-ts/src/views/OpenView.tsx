import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCapsule } from '@/hooks/useCapsule'
import CapsuleCodeInput from '@/components/CapsuleCodeInput'
import CapsuleCard from '@/components/CapsuleCard'

export default function OpenView() {
  const { code: routeCode } = useParams<{ code?: string }>()
  const { capsule, loading, error, get } = useCapsule()
  const [code, setCode] = useState(routeCode || '')

  useEffect(() => {
    if (routeCode) {
      setCode(routeCode)
      get(routeCode).catch(() => {})
    }
  }, [routeCode, get])

  function handleQuery(c: string) {
    get(c).catch(() => {})
  }

  function handleExpired() {
    const currentCode = capsule?.code || code
    if (currentCode) get(currentCode).catch(() => {})
  }

  return (
    <div className="page">
      <div className="container container-sm">
        <div className="page-header">
          <h1>开启时间胶囊</h1>
          <p>输入胶囊码，查看时间胶囊</p>
        </div>

        <CapsuleCodeInput
          value={code}
          onChange={setCode}
          onSubmit={handleQuery}
          loading={loading}
          error={error}
        />

        {capsule && (
          <div className="mt-8">
            <CapsuleCard capsule={capsule} onExpired={handleExpired} />
          </div>
        )}
      </div>
    </div>
  )
}
