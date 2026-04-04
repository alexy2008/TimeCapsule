'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function AboutSecretOrb() {
  const router = useRouter()
  const clickCount = useRef(0)

  function handleSecretClick() {
    clickCount.current += 1

    if (clickCount.current >= 5) {
      clickCount.current = 0
      router.push('/admin')
    }
  }

  return (
    <div
      className="tech-orb"
      onClick={handleSecretClick}
      role="button"
      tabIndex={0}
      aria-label="隐藏管理入口"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSecretClick()
        }
      }}
    >
      <div className="orb-core"></div>
      <div className="orb-ring ring-1"></div>
      <div className="orb-ring ring-2"></div>
    </div>
  )
}
