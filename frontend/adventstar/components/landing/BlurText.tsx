'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  className?: string
  wordDelay?: number
  /** Start animation immediately on mount instead of waiting for scroll */
  immediate?: boolean
}

export default function BlurText({
  text,
  className = '',
  wordDelay = 70,
  immediate = false,
}: Props) {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (immediate) {
      const t = setTimeout(() => setRevealed(true), 100)
      return () => clearTimeout(t)
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [immediate])

  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            opacity: revealed ? 1 : 0,
            filter: revealed ? 'blur(0px)' : 'blur(12px)',
            transform: revealed ? 'translateY(0)' : 'translateY(12px)',
            transition: [
              `opacity 0.7s ease ${i * wordDelay}ms`,
              `filter 0.7s ease ${i * wordDelay}ms`,
              `transform 0.65s ease ${i * wordDelay}ms`,
            ].join(', '),
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
