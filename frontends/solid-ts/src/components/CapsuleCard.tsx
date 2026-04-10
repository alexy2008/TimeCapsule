import { Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import type { Capsule } from '@/types'
import CountdownClock from '@/components/CountdownClock'

interface CapsuleCardProps {
  capsule: Capsule
  onExpired?: () => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function CapsuleCard(props: CapsuleCardProps) {
  const [animating, setAnimating] = createSignal(false)

  createEffect(() => {
    if (!(props.capsule.opened && props.capsule.content)) return
    setAnimating(true)
    const timeout = window.setTimeout(() => setAnimating(false), 2500)
    onCleanup(() => window.clearTimeout(timeout))
  })

  const progress = createMemo(() => {
    const created = new Date(props.capsule.createdAt).getTime()
    const open = new Date(props.capsule.openAt).getTime()
    const now = Date.now()
    return Math.max(0, Math.min(100, ((now - created) / (open - created)) * 100))
  })

  return (
    <Show
      when={props.capsule.opened && props.capsule.content}
      fallback={
        <div class="capsule-locked-card cyber-glass">
          <div class="locked-header">
            <span class="mono-font label">胶囊码: {props.capsule.code}</span>
            <span class="badge badge-locked pulse-danger">未到时间</span>
          </div>

          <h1 class="capsule-title">{props.capsule.title}</h1>
          <div class="meta-info">
            <span class="creator">
              发布者: <span class="mono-font">{props.capsule.creator}</span>
            </span>
            <span class="created-at">
              创建时间: <span class="mono-font">{formatTime(props.capsule.createdAt)}</span>
            </span>
          </div>

          <CountdownClock targetIso={props.capsule.openAt} onExpired={props.onExpired} />

          <div class="data-encryption-visual mt-8">
            <div class="scramble-text mono-font" style={{ opacity: 0.7, 'margin-bottom': '0.5rem', 'font-size': '0.85rem' }}>
              0x8F9A... 内容已被锁定 ...3B2C1
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" style={{ width: `${progress()}%` }}></div>
            </div>
            <div class="target-time mt-2" style={{ 'font-size': '0.85rem', color: 'var(--text-secondary)' }}>
              开启时间: <span class="mono-font text-glow">{formatTime(props.capsule.openAt)}</span>
            </div>
          </div>
        </div>
      }
    >
      <div class="capsule-unlocked-card cyber-glass">
        <div class="locked-header">
          <span class="mono-font label">胶囊码: {props.capsule.code}</span>
          <span class="badge badge-unlocked">已解锁</span>
        </div>

        <h1 class="capsule-title text-glow-cyan">{props.capsule.title}</h1>

        <div class="meta-info border-bottom pb-4 mb-4">
          <span class="creator">
            发布者: <span class="mono-font">{props.capsule.creator}</span>
          </span>
          <div>
            <span class="created-at d-block">
              创建时间: <span class="mono-font">{formatTime(props.capsule.createdAt)}</span>
            </span>
            <span class="opened-at d-block mt-1 cyan-text">
              开启时间: <span class="mono-font">{formatTime(props.capsule.openAt)}</span>
            </span>
          </div>
        </div>

        <div class="capsule-content-area" style={{ position: 'relative' }}>
          {animating() && (
            <div class="decrypt-animation-overlay">
              <div class="scanner-beam"></div>
              <div class="binary-rain mono-font">01001010...</div>
            </div>
          )}
          <div class="content-text" style={{ opacity: animating() ? 0 : 1, transition: 'opacity 0.5s ease', 'white-space': 'pre-wrap' }}>
            {props.capsule.content}
          </div>
        </div>
      </div>
    </Show>
  )
}
