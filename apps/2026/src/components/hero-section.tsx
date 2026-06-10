import { Container } from './container'
import { SelectWordmark } from './brand'
import { HeroCanvas } from './hero-canvas'
import { EVENT } from '@/lib/site-data'

export function HeroSection() {
  return (
    <header>
      {/* Full-bleed PixiJS halftone field — shorter band on mobile, taller on desktop */}
      <HeroCanvas className="h-[clamp(300px,48vw,440px)] w-full md:h-[clamp(420px,52vw,760px)]" />

      <Container className="pt-12 md:pt-20">
        {/* Wordmark + event meta */}
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="order-1 flex w-full items-start justify-between gap-4 text-[15px] font-medium leading-5 text-black/70 md:order-2 md:w-auto md:flex-col md:items-end md:gap-5 md:text-right md:text-[16px] md:leading-5">
            <span>{EVENT.date}</span>
            <span className="text-right">
              {EVENT.addressLine1}
              <br />
              {EVENT.addressLine2}
            </span>
          </div>
          <SelectWordmark className="order-2 h-[44px] text-brand md:order-1 md:h-[60px]" />
        </div>

        {/* Tagline + CTA */}
        <p className="mt-11 max-w-[440px] text-[16px] font-medium leading-[22px] text-black/70 md:mt-16">
          Select is in person and application only. Please apply below.
        </p>

        <a
          href={EVENT.applyHref}
          className="mt-5 flex h-[48px] w-full items-center justify-center bg-brand text-[14px] tracking-[0.02em] text-cream-100 transition-colors hover:bg-brand/90 md:h-[45px] md:w-[321px]"
        >
          APPLY
        </a>

        <div className="mt-12 h-px w-full bg-black/10 md:mt-20" />
      </Container>
    </header>
  )
}
