import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCapsule } from '@/hooks/useCapsule'
import CapsuleCodeInput from '@/components/CapsuleCodeInput'
import CapsuleCard from '@/components/CapsuleCard'

export default function OpenView() {
  const navigate = useNavigate()
  const { code: routeCode } = useParams<{ code?: string }>()
  const { capsule, loading, error, get, clear } = useCapsule()
  const [code, setCode] = useState(routeCode || '')

  useEffect(() => {
    if (routeCode) {
      setCode(routeCode)
      get(routeCode).catch(() => {})
    } else {
      clear()
    }
  }, [routeCode, get, clear])

  function handleQuery(c: string) {
    navigate(`/open/${c}`)
  }

  function handleExpired() {
    const currentCode = capsule?.code || code
    if (currentCode) get(currentCode).catch(() => {})
  }

  return (
    <section id="view-search" className="view active">
      <div className="view-header">
          <button className="btn-back" onClick={() => {
            if (capsule) {
                clear();
                navigate('/open');
            } else {
                navigate('/');
            }
          }}>
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
