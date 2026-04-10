import { Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'

interface CountdownClockProps {
  targetIso: string
  onExpired?: () => void
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export default function CountdownClock(props: CountdownClockProps) {
  const [now, setNow] = createSignal(Date.now())

  const countdown = createMemo(() => {
    const diff = new Date(props.targetIso).getTime() - now()
    if (diff < 1000) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const totalSeconds = Math.floor(diff / 1000)
    return {
      expired: false,
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    }
  })

  const timer = window.setInterval(() => setNow(Date.now()), 1000)
  onCleanup(() => window.clearInterval(timer))

  createEffect(() => {
    if (!countdown().expired || !props.onExpired) return
    const timeout = window.setTimeout(() => props.onExpired?.(), 3000)
    onCleanup(() => window.clearTimeout(timeout))
  })

  return (
    <Show
      when={!countdown().expired}
      fallback={
        <div class="text-center mt-6">
          <div style={{ 'font-size': '2rem' }}>🎉</div>
          <span class="text-secondary mt-2 inline-block">时间已到，胶囊即将开启…</span>
        </div>
      }
    >
      <div class="countdown-display">
        <div class="countdown-ring"></div>
        <div class="countdown-text">
          <div class="time-block">
            <span class="mono-font num">{pad(countdown().days)}</span>
            <span class="unit">天</span>
          </div>
          <span class="colon">:</span>
          <div class="time-block">
            <span class="mono-font num">{pad(countdown().hours)}</span>
            <span class="unit">时</span>
          </div>
          <span class="colon">:</span>
          <div class="time-block">
            <span class="mono-font num">{pad(countdown().minutes)}</span>
            <span class="unit">分</span>
          </div>
          <span class="colon">:</span>
          <div class="time-block">
            <span class="mono-font num glow-text">{pad(countdown().seconds)}</span>
            <span class="unit">秒</span>
          </div>
        </div>
      </div>
    </Show>
  )
}
