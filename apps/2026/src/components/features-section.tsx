import { Container } from './container'
import { FEATURES } from '@/lib/site-data'

export function FeaturesSection() {
  return (
    <section className="pb-14 pt-12 md:pb-20 md:pt-[133px]">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[394fr_385fr_324fr]">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-[16px] font-medium leading-[19px] text-black/70">
                {feature.title}
              </h3>
              <p className="mt-3.5 max-w-[324px] text-[14px] leading-[17px] text-black/60">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
