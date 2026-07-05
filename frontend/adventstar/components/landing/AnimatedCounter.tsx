'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  to: number
  suffix?: string
  duration?: number
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function AnimatedCounter({ to, suffix = '', duration = 1800 }: Props) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return
        fired.current = true
        observer.disconnect()
        let start = 0
        const tick = (ts: number) => {
          if (!start) start = ts
          const p = Math.min((ts - start) / duration, 1)
          setCount(Math.round(easeOut(p) * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}
