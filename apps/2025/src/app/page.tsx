import { AboutSection } from "../components/about-section";
import { AnimatedGrid } from "../components/animated-grid";
import { FAQSection } from "../components/faq-section";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { ContentWrapper } from "../components/content-wrapper";
import { LivestreamHero } from "../components/livestream-hero";
import { ScheduleSection } from "../components/schedule-section";
import { SpeakersSection } from "../components/speakers-section";
import { SponsorsSection } from "../components/sponsors-section";
import { TopLines } from "@/components/top-lines";
import { Separator } from "@ui/components/separator";
import { StageProvider } from "../contexts/stage-context";

export default function HomePage() {
  return (
    <StageProvider initialStage="main">
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          {/* <div className="absolute top-32 left-0 right-0 bottom-0 pointer-events-none">
            <AnimatedGrid />
          </div> */}
          <div className="relative z-10">
            <Header />
            <LivestreamHero />
          </div>
        </div>
      </ContentWrapper>
      <ScheduleSection />
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
  );
}
