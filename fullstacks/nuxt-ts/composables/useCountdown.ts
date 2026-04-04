import { ref, onUnmounted } from 'vue'

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

export function useCountdown(targetIso: string) {
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

  const time = ref<CountdownTime>(calc())

  const timer = setInterval(() => {
    const next = calc()
    time.value = next
    if (next.expired) clearInterval(timer)
  }, 1000)

  onUnmounted(() => clearInterval(timer))

  return time
}
