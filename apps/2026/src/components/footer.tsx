import { Container } from './container'
import { SelectWordmark, SupabaseLogo } from './brand'
import { EVENT } from '@/lib/site-data'

export function Footer() {
  return (
    <footer className="pt-16 pb-10 md:pt-24 md:pb-14">
      <Container>
        <div className="flex items-center justify-between text-[14px] leading-[18px]">
          <p>
            <span className="font-medium text-black/70">Select</span>
            <span className="text-black/40"> — {EVENT.dateLong}, San Francisco</span>
          </p>
          <a
            href={EVENT.rsvpHref}
            className="font-medium text-black/70 transition-colors hover:text-brand"
          >
            Apply ↗
          </a>
        </div>

        <SupabaseLogo className="mt-12 opacity-30" />

        <SelectWordmark variant="outline" className="mt-6 w-full text-[#e2d3c8]" />
      </Container>
    </footer>
  )
}
