import { AboutSection } from '../components/about-section'
import { FAQSection } from '../components/faq-section'
import { Footer } from '../components/footer'
import { ContentWrapper } from '../components/content-wrapper'
import { SpeakersSection } from '../components/speakers-section'
import { SponsorsSection } from '../components/sponsors-section'
import { Separator } from '@ui/components/separator'
import { StageProvider } from '../lib/stage-context'
import LiveStreamTabs from '../components/live-stream-tabs'

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
