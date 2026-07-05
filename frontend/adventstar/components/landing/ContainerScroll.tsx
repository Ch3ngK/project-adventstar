'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt: string
}

export default function ContainerScroll({ src, alt }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const { top } = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 → element top at viewport bottom, 1 → element top ~25% from viewport top
      const raw = (vh - top) / (vh * 0.75)
      setProgress(Math.max(0, Math.min(1, raw)))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const rotateX = 20 * (1 - progress)
  const scale = 0.88 + 0.12 * progress
  const translateY = 20 * (1 - progress)

  return (
    <div ref={sectionRef} style={{ perspective: '1200px' }}>
      <div
        style={{
          transform: `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: '50% 0%',
          transition: 'transform 0.08s linear',
          willChange: 'transform',
        }}
        className="relative w-full overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-[0_32px_96px_rgba(16,40,74,0.14)]"
      >
        <div className="relative aspect-[16/8] w-full">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c]/25 to-transparent" />
        </div>
      </div>
    </div>
  )
}
