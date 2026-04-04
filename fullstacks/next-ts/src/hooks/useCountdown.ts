import { useState, useEffect } from 'react'

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

export function useCountdown(targetIso: string): CountdownTime {
  function calc(): CountdownTime {
    const diff = new Date(targetIso).getTime() - Date.now()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    }
    const totalSeconds = Math.floor(diff / 1000)
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      expired: false,
    }
  }

  const [time, setTime] = useState<CountdownTime>(calc)

  useEffect(() => {
    if (time.expired) return
    const timer = setInterval(() => {
      const next = calc()
      setTime(next)
      if (next.expired) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [targetIso, time.expired])

  return time
}
