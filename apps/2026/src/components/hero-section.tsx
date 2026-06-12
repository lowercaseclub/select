import { Container } from './container'
import { SelectWordmark } from './brand'
import { HeroCanvas } from './hero-canvas'
import { EVENT } from '@/lib/site-data'

export function HeroSection() {
  return (
    <header>
      {/* Full-bleed text-art field — tall portrait band on mobile, ~46vw on desktop */}
      <HeroCanvas className="h-[clamp(300px,108vw,420px)] w-full md:h-[clamp(420px,45.9vw,792px)]" />

      <Container className="pt-12 md:pt-[108px]">
        <SelectWordmark className="h-[33px] text-brand" />

        {/* Info row — stacked on mobile, three flush columns on desktop */}
        <div className="mt-6 grid grid-cols-1 text-[16px] font-medium leading-[19px] text-black/60 md:mt-[127px] md:grid-cols-[394fr_385fr_324fr]">
          <p>
            Curated day of talks by{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors [text-underline-position:from-font] hover:text-black/80"
            >
              Supabase
            </a>
          </p>

          <div className="mt-10 md:mt-0">
            <p>{EVENT.date}</p>
            <p className="mt-[19px]">
              {EVENT.addressLine1}
              <br />
              {EVENT.addressLine2}
            </p>
          </div>

          <div className="mt-8 max-w-[324px] md:mt-0">
            <p>Select is in person and application only.</p>
            <p className="mt-[19px]">
              Please apply below.
              <span className="hidden md:inline">
                <br />
                $256 per person.
              </span>
            </p>
            <a
              href={EVENT.rsvpHref}
              className="mt-6 flex h-[41px] w-full items-center justify-center bg-brand text-[14px] font-normal leading-[17px] text-cream-100 transition-colors hover:bg-brand/90 md:mt-[29px] md:w-[160px]"
            >
              RSVP via Luma
            </a>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-brand/10 md:mt-[92px]" />
      </Container>
    </header>
  )
}
