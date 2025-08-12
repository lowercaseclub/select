import { AnimatedGrid } from "../components/animated-grid";
import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedGrid />

      <div className="relative z-10">
        <Header />
        <HeroSection />
      </div>
    </div>
  );
}
