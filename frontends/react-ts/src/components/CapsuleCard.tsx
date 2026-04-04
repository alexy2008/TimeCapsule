import { useState, useEffect } from 'react'
import type { Capsule } from '@/types'
import CountdownClock from './CountdownClock'

interface Props {
  capsule: Capsule
  onExpired?: () => void
}

export default function CapsuleCard({ capsule, onExpired }: Props) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (capsule.opened && capsule.content) {
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [capsule.code, capsule.opened, capsule.content])

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  }

  if (capsule.opened && capsule.content) {
    return (
      <div className="capsule-unlocked-card cyber-glass">
          <div className="locked-header">
              <span className="mono-font label">胶囊码: {capsule.code}</span>
              <span className="badge badge-unlocked">已解锁</span>
          </div>

          <h1 className="capsule-title text-glow-cyan">{capsule.title}</h1>

          <div className="meta-info border-bottom pb-4 mb-4">
              <span className="creator">发布者: <span className="mono-font">{capsule.creator}</span></span>
              <div>
                  <span className="created-at d-block">创建时间: <span className="mono-font">{formatTime(capsule.createdAt)}</span></span>
                  <span className="opened-at d-block mt-1 cyan-text">开启时间: <span className="mono-font">{formatTime(capsule.openAt)}</span></span>
              </div>
          </div>

          <div className="capsule-content-area" style={{ position: 'relative' }}>
              {animating && (
                <div className="decrypt-animation-overlay">
                    <div className="scanner-beam"></div>
                    <div className="binary-rain mono-font">01001010...</div>
                </div>
              )}
              <div className="content-text" style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.5s ease', whiteSpace: 'pre-wrap' }}>
                  {capsule.content}
              </div>
          </div>
      </div>
    )
  }

  // 计算锁定进度
  const created = new Date(capsule.createdAt).getTime()
  const open = new Date(capsule.openAt).getTime()
  const now = Date.now()
  const progress = Math.max(0, Math.min(100, ((now - created) / (open - created)) * 100))

  return (
    <div className="capsule-locked-card cyber-glass">
        <div className="locked-header">
            <span className="mono-font label">胶囊码: {capsule.code}</span>
            <span className="badge badge-locked pulse-danger">未到时间</span>
        </div>

        <h1 className="capsule-title">{capsule.title}</h1>
        <div className="meta-info">
            <span className="creator">发布者: <span className="mono-font">{capsule.creator}</span></span>
            <span className="created-at">创建时间: <span className="mono-font">{formatTime(capsule.createdAt)}</span></span>
        </div>

        <CountdownClock targetIso={capsule.openAt} onExpired={onExpired} />

        <div className="data-encryption-visual mt-8">
            <div className="scramble-text mono-font" style={{ opacity: 0.7, marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              0x8F9A... 内容已被锁定 ...3B2C1
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="target-time mt-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              开启时间: <span className="mono-font text-glow">{formatTime(capsule.openAt)}</span>
            </div>
        </div>
    </div>
  )
}
