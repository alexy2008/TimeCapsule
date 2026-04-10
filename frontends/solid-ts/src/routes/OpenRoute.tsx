import { on, createEffect, createSignal, onCleanup } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import type { Capsule } from '@/types'
import { getCapsule } from '@/lib/api'
import CapsuleCodeInput from '@/components/CapsuleCodeInput'
import CapsuleCard from '@/components/CapsuleCard'

export default function OpenRoute() {
  const navigate = useNavigate()
  const params = useParams()
  const [code, setCode] = createSignal(params.code ?? '')
  const [capsule, setCapsule] = createSignal<Capsule | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  let requestId = 0

  async function queryCapsule(targetCode: string) {
    const normalized = targetCode.trim()
    if (!normalized) return
    const currentRequest = ++requestId
    setLoading(true)
    setError(null)
    try {
      const response = await getCapsule(normalized)
      if (currentRequest !== requestId) return
      setCapsule(response.data)
    } catch (err) {
      if (currentRequest !== requestId) return
      setError(err instanceof Error ? err.message : '查询失败')
      setCapsule(null)
    } finally {
      if (currentRequest === requestId) {
        setLoading(false)
      }
    }
  }

  createEffect(
    on(
      () => params.code,
      routeCode => {
        if (routeCode) {
          setCode(routeCode)
          void queryCapsule(routeCode)
        } else {
          setCode('')
          setCapsule(null)
          setError(null)
        }
      },
      { defer: false },
    ),
  )

  createEffect(() => {
    const current = capsule()
    if (!current || current.opened) return

    const delay = new Date(current.openAt).getTime() - Date.now() + 150
    if (delay <= 0) {
      void queryCapsule(current.code)
      return
    }

    const timeout = window.setTimeout(() => {
      void queryCapsule(current.code)
    }, delay)

    onCleanup(() => window.clearTimeout(timeout))
  })

  function handleQuery(nextCode: string) {
    navigate(`/open/${nextCode}`)
  }

  function handleExpired() {
    const currentCode = capsule()?.code || code()
    if (currentCode) {
      void queryCapsule(currentCode)
    }
  }

  return (
    <section id="view-search" class="view active">
      <div class="view-header">
        <button
          class="btn-back"
          onClick={() => {
            if (capsule()) {
              setCapsule(null)
              navigate('/open')
            } else {
              navigate('/')
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>{capsule() ? (capsule()!.opened ? '状态: 已解锁' : '状态: 锁定中') : '打开时间胶囊'}</h2>
      </div>

      {!capsule() ? (
        <CapsuleCodeInput value={code()} onChange={setCode} onSubmit={handleQuery} loading={loading()} error={error()} />
      ) : (
        <CapsuleCard capsule={capsule()!} onExpired={handleExpired} />
      )}
    </section>
  )
}
