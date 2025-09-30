import { ContentWrapper } from '../components/content-wrapper'
import LiveStreamTabs from '@/components/live-stream-tabs'
import dynamic from 'next/dynamic'

const AboutSection = dynamic(() =>
  import('@/components/about-section').then((mod) => mod.AboutSection)
)
const FAQSection = dynamic(() => import('@/components/faq-section').then((mod) => mod.FAQSection))
const SpeakersSection = dynamic(() =>
  import('@/components/speakers-section').then((mod) => mod.SpeakersSection)
)
const SponsorsSection = dynamic(() =>
  import('@/components/sponsors-section').then((mod) => mod.SponsorsSection)
)
const Separator = dynamic(() => import('@ui/components/separator').then((mod) => mod.Separator))
const StageProvider = dynamic(() => import('@/lib/stage-context').then((mod) => mod.StageProvider))
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer))

export default function HomePage() {
  return (
    <StageProvider initialStage="main">
      <LiveStreamTabs />
      <ContentWrapper>
        <SpeakersSection />
      </ContentWrapper>
      <ContentWrapper>
        <AboutSection />
      </ContentWrapper>
      <Separator />
      <ContentWrapper>
        <SponsorsSection />
        <FAQSection />
      </ContentWrapper>
      <Footer />
    </StageProvider>
  )
}
