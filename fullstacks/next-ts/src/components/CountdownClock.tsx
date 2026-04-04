'use client'

import { useEffect } from 'react'
import { useCountdown } from '@/hooks/useCountdown'

interface Props {
  targetIso: string
  onExpired?: () => void
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function CountdownClock({ targetIso, onExpired }: Props) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetIso)

  useEffect(() => {
    if (!expired || !onExpired) return
    const timer = setTimeout(onExpired, 3000)
    return () => clearTimeout(timer)
  }, [expired, onExpired])

  if (expired) {
    return (
      <div className="text-center mt-6">
        <div style={{fontSize: '2rem'}}>🎉</div>
        <span className="text-secondary mt-2 inline-block">时间已到，胶囊即将开启…</span>
      </div>
    )
  }

  const units = [
    { value: days,    label: '天' },
    { value: hours,   label: '时' },
    { value: minutes, label: '分' },
    { value: seconds, label: '秒' },
  ]

  return (
    <div className="countdown-display">
        <div className="countdown-ring"></div>
        <div className="countdown-text">
            {units.map(({ value, label }, i) => (
                <span key={label} style={{display: 'contents'}}>
                    <div className="time-block">
                        <span className={`mono-font num ${i === 3 ? 'glow-text' : ''}`}>{pad(value)}</span>
                        <span className="unit">{label}</span>
                    </div>
                    {i < units.length - 1 && <span className="colon">:</span>}
                </span>
            ))}
        </div>
    </div>
  )
}
