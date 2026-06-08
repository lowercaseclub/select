import { Container } from './container'
import { RESEARCH } from '@/lib/site-data'

export function ResearchSection() {
  return (
    <section className="w-full bg-gradient-to-b from-cream-200 to-cream-100">
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[324px_minmax(0,560px)] md:gap-x-[64px]">
          <h2 className="text-[16px] font-medium leading-5 text-black/90">
            Database Research Announcements
          </h2>

          <div>
            <p className="max-w-[560px] text-[14px] leading-[18px] text-black/60">
              A first look at the deep database research coming out of Supabase. These are the
              projects shaping what Postgres can do next.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-[64px]">
              {RESEARCH.map((item) => (
                <div key={item.alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logo} alt={item.alt} className="h-6 w-auto" />
                  <p className="mt-7 text-[14px] leading-[18px] text-black/60">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
