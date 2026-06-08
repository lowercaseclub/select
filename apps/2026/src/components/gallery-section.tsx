'use client'

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
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
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true }, [
    AutoScroll({ speed: 1, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  return (
    <section className="overflow-hidden py-14 md:py-20">
      <div
        className="cursor-grab overflow-hidden px-6 active:cursor-grabbing md:px-0"
        ref={emblaRef}
      >
        {/* Spacing lives on each slide (padding-left) instead of `gap` so the
            loop seam keeps even spacing; the container's negative margin cancels
            the first slide's padding. `gap` leaves no space after the last
            slide, so wrapped slides would butt together. */}
        <div className="-ml-2 flex items-start md:-ml-3">
          {SLIDES.map((item, i) => (
            <figure key={i} className="min-w-0 shrink-0 pl-2 md:pl-3">
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
