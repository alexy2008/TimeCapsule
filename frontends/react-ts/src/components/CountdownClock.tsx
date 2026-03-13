import { useEffect } from 'react'
import { useCountdown } from '@/hooks/useCountdown'
import styles from './CountdownClock.module.css'

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
      <div className={styles.expiredMsg}>
        <span className={styles.expiredIcon}>🎉</span>
        <span>时间已到，胶囊即将开启…</span>
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
    <div className={styles.clock}>
      <p className={styles.clockTitle}>距离开启还有</p>
      <div className={styles.units}>
        {units.map(({ value, label }, i) => (
          <div key={label} className={styles.unitGroup}>
            <div className={styles.card}>
              <span className={styles.number}>{pad(value)}</span>
            </div>
            <span className={styles.label}>{label}</span>
            {i < units.length - 1 && (
              <span className={styles.colon}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
