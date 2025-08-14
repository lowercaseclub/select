import { Suspense } from "react";
import { AboutSection } from "../components/about-section";
import { AnimatedGrid } from "../components/animated-grid";
import { ColumnLine } from "../components/column-line";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";

import { ScheduleSection } from "../components/schedule-section";
import { SpeakersSection } from "../components/speakers-section";
import { SpeakersLoading } from "../components/speakers-loading";

export const revalidate = 300; // 5 minutes

export default function HomePage() {
  return (
    <>
      <div className="relative overflow-hidden border-b border-l border-r border-column-lines max-w-site mx-auto">
        <ColumnLine />
        <div className="absolute border-t w-full h-px top-24"></div>
        <div className="absolute border-t w-full h-px top-32"></div>

        <div className="relative border-b">
          <div className="absolute top-32 left-0 right-0 bottom-0">
            <AnimatedGrid />
          </div>
          <div className="relative z-1">
            <Header />
            <HeroSection />
          </div>
        </div>
        <AboutSection />
        <Suspense fallback={<SpeakersLoading />}>
          <SpeakersSection />
        </Suspense>
      </div>
      <ScheduleSection />
      <Footer />
    </>
  );
}
