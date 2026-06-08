import { Container } from './container'
import { FEATURES } from '@/lib/site-data'

const ICONS = [FeatureIconNext, FeatureIconBuilders, FeatureIconTeam]

export function FeaturesSection() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-[64px]">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[i]
            return (
              <div key={feature.title}>
                <Icon className="h-[60px] text-black/30" />
                <h3 className="mt-8 text-[16px] font-medium leading-5 text-black/70">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-[324px] text-[14px] leading-[18px] text-black/60">
                  {feature.body}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function FeatureIconNext({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 67 67"
      fill="none"
      stroke="currentColor"
      className={className}
      style={{ width: 'auto' }}
      aria-hidden
    >
      <rect x="0.5" y="0.5" width="66" height="66" />
      <circle cx="42" cy="38" r="24.75" />
      <rect x="0.5" y="0.5" width="16.5" height="16.5" />
      <rect x="0.5" y="16.75" width="16.5" height="16.5" />
      <rect x="0.5" y="33" width="16.5" height="16.5" />
      <rect x="0.5" y="49.5" width="16.5" height="16.5" />
    </svg>
  )
}

function FeatureIconBuilders({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 67 67"
      fill="none"
      stroke="currentColor"
      className={className}
      style={{ width: 'auto' }}
      aria-hidden
    >
      <rect x="0.5" y="0.5" width="66" height="66" />
      <circle cx="38" cy="42" r="24.75" />
      <rect x="0.5" y="0.5" width="16.5" height="16.5" />
      <rect x="16.75" y="0.5" width="16.5" height="16.5" />
      <rect x="33" y="0.5" width="16.5" height="16.5" />
      <rect x="49.5" y="0.5" width="16.5" height="16.5" />
    </svg>
  )
}

function FeatureIconTeam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 235 99" fill="none" className={className} style={{ width: 'auto' }} aria-hidden>
      <g stroke="currentColor" strokeWidth="0.5">
        <path d="M62.168 95.75L83.043 47.75" />
        <path d="M83.043 47.75L232.043 20" />
        <path d="M32.25 73.25L83.043 47.75" />
        <path d="M53.25 42L82.918 47.875" />
        <path d="M81.918 2.625L82.793 47.875M176.293 68L82.793 47.875L2.543 19.625M82.793 47.875L131.418 52.75" />
      </g>
      <g fill="currentColor">
        <circle cx="2.75" cy="19.75" r="2.75" />
        <circle cx="81.75" cy="2.75" r="2.75" />
        <circle cx="232.25" cy="19.75" r="2.75" />
        <circle cx="176.25" cy="67.75" r="2.75" />
        <circle cx="61.75" cy="95.75" r="2.75" />
        <circle cx="32.25" cy="73.25" r="2.75" />
        <circle cx="53.25" cy="42" r="2.75" />
        <circle cx="131.25" cy="52.695" r="2.75" />
      </g>
    </svg>
  )
}
