'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/cn'
import type { HeroEngine } from '@/lib/hero/engine'

// Dev-only sim tuning panel; the dead branch is dropped from prod bundles.
const HeroTweaks =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('./hero-tweaks'), { ssr: false })
    : null

export function HeroCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<HeroEngine | null>(null)

  useEffect(() => {
    const host = hostRef.current
    const overlay = overlayRef.current
    if (!host || !overlay) return

    let disposed = false
    let engine: HeroEngine | null = null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Dynamic import keeps pixi.js out of the initial bundle.
    import('@/lib/hero/engine').then(async ({ createHeroEngine }) => {
      if (disposed) return
      const created = await createHeroEngine(host, overlay, { reducedMotion })
      if (disposed) {
        created.destroy()
        return
      }
      engine = created
      engineRef.current = created
    })

    return () => {
      disposed = true
      engine?.destroy()
      engine = null
      engineRef.current = null
    }
  }, [])

  return (
    <>
      <div
        className={cn('relative overflow-hidden bg-[#141413]', className)}
        aria-hidden="true"
      >
        <div ref={hostRef} className="absolute inset-0" />
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 origin-top-left will-change-transform"
        />
      </div>
      {HeroTweaks ? <HeroTweaks engineRef={engineRef} /> : null}
    </>
  )
}
