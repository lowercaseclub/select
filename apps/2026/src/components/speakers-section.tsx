import { Container } from './container'
import { ComingSoonFrame } from './coming-soon'
import { SPEAKERS, COMING_SOON_SLOTS, type Speaker } from '@/lib/site-data'

export function SpeakersSection() {
  return (
    <section className="py-14 md:py-16">
      <Container>
        <h2 className="text-[16px] font-medium leading-5 text-black/90">Speakers</h2>

        <div className="mt-6 grid grid-cols-2 items-start gap-x-[10px] gap-y-6 md:mt-8 md:grid-cols-4 md:gap-x-[55px] md:gap-y-12">
          {SPEAKERS.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
          {Array.from({ length: COMING_SOON_SLOTS }).map((_, i) => (
            <ComingSoonFrame key={`soon-${i}`} className="aspect-[235/246] w-full" />
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
        className="photo aspect-[234/247] w-full bg-cream-100"
        style={{ backgroundImage: `url(${speaker.image})` }}
        role="img"
        aria-label={speaker.name}
      />
      <div className="mt-2.5 flex flex-col gap-1 text-[14px] font-medium leading-[17px]">
        <span className="text-black/70">{speaker.name}</span>
        <span className="text-black/30">{speaker.role}</span>
      </div>
    </div>
  )
}
