'use client'

import { useEffect, useRef, useState } from 'react'

type Strength = {
  title: string
  description: string
}

type Props = {
  src: string
  poster?: string
  strengths: Strength[]
}

export default function UniformScrollShowcase({ src, poster, strengths }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [blobSrc, setBlobSrc] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Fetch the whole file into memory before scrubbing starts. Plain
  // preload="auto" only buffers progressively — once scrubbing jumps past
  // whatever's been downloaded so far, each seek can trigger (and cancel)
  // a fresh range request before it lands, stalling the video mid-scroll.
  // A blob URL makes every seek instant and local, no network involved.
  useEffect(() => {
    if (reducedMotion) return
    let objectUrl: string | null = null
    let cancelled = false
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setBlobSrc(objectUrl)
      })
      .catch((err) => console.error('[UniformScrollShowcase] failed to preload video', err))
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src, reducedMotion])

  // Respect reduced-motion preference — skip scroll-jacking entirely
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Warm up video decoding so iOS/Safari allow programmatic seeking later
  useEffect(() => {
    if (reducedMotion || !blobSrc) return
    const video = videoRef.current
    if (!video) return
    video
      .play()
      .then(() => video.pause())
      .catch(() => {})
  }, [reducedMotion, blobSrc])

  // Covers the race where metadata resolves (e.g. cached asset) before the
  // onLoadedMetadata listener attaches, which would otherwise leave
  // duration stuck at 0 forever and permanently block scrubbing below.
  useEffect(() => {
    const video = videoRef.current
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration)
    }
  }, [blobSrc])

  useEffect(() => {
    if (reducedMotion) return
    const wrap = wrapRef.current
    if (!wrap) return

    let ticking = false
    const update = () => {
      ticking = false
      const { top, height } = wrap.getBoundingClientRect()
      const scrollable = height - window.innerHeight
      const raw = scrollable > 0 ? -top / scrollable : 0
      const clamped = Math.max(0, Math.min(1, raw))
      progressRef.current = clamped
      setProgress(clamped)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  // Ease the video toward the scroll-derived target instead of snapping.
  // Runs as one persistent rAF loop reading progressRef each frame — tying
  // this to the `progress` state instead would restart (and cancel) the
  // loop on every scroll tick, before it ever gets to move currentTime.
  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion || !duration || !Number.isFinite(duration)) return

    let raf = 0
    const step = () => {
      const target = progressRef.current * duration
      const delta = target - video.currentTime
      try {
        video.currentTime += Math.abs(delta) < 0.02 ? delta : delta * 0.45
      } catch (err) {
        console.error('[UniformScrollShowcase] seek failed', err)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [duration, reducedMotion])

  const activeIndex = Math.min(
    strengths.length - 1,
    Math.floor(progress * strengths.length),
  )

  // Scroll distance scales with the video's own length so scrub pace stays
  // consistent (~120vh of scroll per second of footage) instead of cramming
  // a longer clip into a fixed distance, which would make it feel rushed.
  // Falls back to a caption-driven minimum before duration is known.
  const minScrollVh = (strengths.length + 1) * 100
  const scrollVh = duration ? Math.max(minScrollVh, Math.round(duration * 120)) : minScrollVh

  if (reducedMotion) {
    return (
      <div className="space-y-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-[0_32px_96px_rgba(16,40,74,0.14)]">
          <video src={src} poster={poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {strengths.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-bold tracking-[0.2em] text-slate-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div ref={wrapRef} style={{ height: `${scrollVh}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="relative mx-auto w-full max-w-[100rem] px-4 lg:px-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#0d1f3c] shadow-[0_32px_96px_rgba(16,40,74,0.14)]">
            {/* Resource hint gets the fetch below started as early as the browser will allow */}
            <link rel="preload" as="fetch" href={src} crossOrigin="anonymous" />
            <video
              ref={videoRef}
              src={blobSrc ?? undefined}
              poster={poster}
              muted
              playsInline
              preload="auto"
              aria-hidden
              className="h-full w-full object-cover"
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onError={(e) => console.error('[UniformScrollShowcase] video failed to load', e.currentTarget.error)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/85 via-[#0a1929]/10 to-transparent" />

            {/* Strength callouts — cross-fade at scroll intervals */}
            <div className="absolute inset-x-7 bottom-7 sm:inset-x-10 sm:bottom-10">
              <div className="relative h-28 sm:h-24">
                {strengths.map((s, i) => (
                  <div
                    key={s.title}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      opacity: activeIndex === i ? 1 : 0,
                      transform: activeIndex === i ? 'translateY(0)' : 'translateY(16px)',
                      pointerEvents: activeIndex === i ? 'auto' : 'none',
                    }}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0d1f3c]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{s.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-200 sm:text-base">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute right-7 top-7 flex flex-col gap-2 sm:right-10 sm:top-10">
              {strengths.map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="h-1.5 w-6 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
