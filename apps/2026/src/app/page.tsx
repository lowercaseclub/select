import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { SpeakersSection } from '@/components/speakers-section'
import { AgendaSection } from '@/components/agenda-section'
import { ResearchSection } from '@/components/research-section'
import { GallerySection } from '@/components/gallery-section'
import { SponsorsSection } from '@/components/sponsors-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <SpeakersSection />
      <AgendaSection />
      <ResearchSection />
      <GallerySection />
      <SponsorsSection />
      <Footer />
    </main>
  )
}
