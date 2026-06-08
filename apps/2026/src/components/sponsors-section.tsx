import { Container } from './container'
import { SPONSORS } from '@/lib/site-data'

export function SponsorsSection() {
  return (
    <section className="py-14 md:py-16">
      <Container>
        <h2 className="text-[16px] font-medium leading-5 text-black/90">Sponsors</h2>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-8">
          {SPONSORS.map((sponsor) => (
            <a
              key={sponsor.alt}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[130px] items-center justify-center border border-hairline transition-colors duration-200 hover:bg-black/[0.03] md:h-[151px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.logo}
                alt={sponsor.alt}
                style={{ height: sponsor.height }}
                className="w-auto"
              />
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
