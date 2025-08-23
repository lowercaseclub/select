import { AboutSection } from "../components/about-section";
import { AnimatedGrid } from "../components/animated-grid";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { ContentWrapper } from "../components/content-wrapper";
import { HeroSection } from "../components/hero-section";
import { ScheduleSection } from "../components/schedule-section";
import { SpeakersSection } from "../components/speakers-section";
import { TopLines } from "@/components/top-lines";

export const revalidate = 300; // 5 minutes

export default function HomePage() {
  return (
    <>
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          <div className="absolute top-32 left-0 right-0 bottom-0">
            <AnimatedGrid />
          </div>
          <div className="relative z-10">
            <Header />
            <HeroSection />
          </div>
        </div>
      </ContentWrapper>
      <ContentWrapper>
        <AboutSection />
        <SpeakersSection />
      </ContentWrapper>
      <ScheduleSection />
      <Footer />
    </>
  );
}
