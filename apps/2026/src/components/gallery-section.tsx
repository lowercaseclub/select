'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { GALLERY } from '@/lib/site-data'
import { cn } from '@/lib/cn'

// Deliberately uneven heights for an editorial, contact-sheet rhythm.
const HEIGHTS = [
  'h-[240px] md:h-[348px]',
  'h-[260px] md:h-[424px]',
  'h-[280px] md:h-[483px]',
  'h-[260px] md:h-[424px]',
  'h-[240px] md:h-[348px]',
]

// Doubled so the loop always has enough slide width to wrap seamlessly on wide screens.
const SLIDES = [...GALLERY, ...GALLERY]

export function GallerySection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  })

  return (
    <section className="overflow-hidden py-14 md:py-20">
      {/* Desktop nav — drag/swipe is the primary affordance on touch */}
      <div className="mb-4 hidden items-center justify-end gap-2 px-6 md:flex md:px-0">
        <NavButton label="Previous photos" onClick={() => emblaApi?.scrollPrev()}>
          ←
        </NavButton>
        <NavButton label="Next photos" onClick={() => emblaApi?.scrollNext()}>
          →
        </NavButton>
      </div>

      <div className="overflow-hidden px-6 md:px-0" ref={emblaRef}>
        <div className="flex items-start gap-2 md:gap-3">
          {SLIDES.map((item, i) => (
            <figure key={i} className="min-w-0 shrink-0">
              <div
                className={cn(
                  'photo w-[230px] bg-cream-100 md:w-[330px]',
                  HEIGHTS[i % HEIGHTS.length],
                )}
                style={{ backgroundImage: `url(${item.image})` }}
                role="img"
                aria-label={item.caption || 'Supabase Select'}
              />
              {item.caption && (
                <figcaption className="mt-2 font-mono text-[10px] leading-3 text-black/60">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-full border border-black/10 font-mono text-sm text-black/70 transition',
        'hover:border-black/30 hover:text-black',
      )}
    >
      {children}
    </button>
  )
}
