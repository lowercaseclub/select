import { AnimatedGrid } from "../components/animated-grid";
import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden border-b border-l border-r border-column-lines">
      <div className="h-full w-px bg-column-lines absolute top-0 left-8"></div>
      <div className="absolute border-t w-full h-px top-24"></div>
      <div className="absolute border-t w-full h-px top-32"></div>

      <div className="absolute top-32 left-0 right-0 bottom-0">
        <AnimatedGrid />
      </div>

      <div className="relative z-1">
        <Header />
        <HeroSection />
      </div>
    </div>
  );
}
