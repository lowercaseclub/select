import { Container } from './container'
import { SPEAKERS, COMING_SOON_SLOTS, type Speaker } from '@/lib/site-data'

export function SpeakersSection() {
  return (
    <section className="py-14 md:py-16">
      <Container>
        <h2 className="text-[16px] font-medium leading-5 text-black/90">Speakers</h2>

        <div className="mt-7 grid grid-cols-2 items-start gap-x-6 gap-y-10 md:mt-8 md:grid-cols-3 md:gap-x-[64px] md:gap-y-12">
          {SPEAKERS.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
          {Array.from({ length: COMING_SOON_SLOTS }).map((_, i) => (
            <ComingSoonCard key={`soon-${i}`} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <div>
      <div
        className="photo aspect-[321/338] w-full bg-cream-100"
        style={{ backgroundImage: `url(${speaker.image})` }}
        role="img"
        aria-label={speaker.name}
      />
      <div className="mt-4 flex flex-wrap gap-x-2 text-[14px] font-medium leading-[18px]">
        <span className="text-black/70">{speaker.name}</span>
        <span className="text-black/30">{speaker.role}</span>
      </div>
    </div>
  )
}

function ComingSoonCard() {
  return (
    <div className="relative aspect-[321/338] w-full border border-hairline">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#D3CFCB" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d9d9d9] px-4 py-1 font-mono text-[12px] font-medium leading-4 tracking-[0.02em] text-black/30">
        COMING SOON
      </span>
    </div>
  )
}
