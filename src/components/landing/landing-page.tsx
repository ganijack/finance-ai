import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { HowItWorksLanding } from "./how-it-works-landing";
import { CtaSection } from "./cta";
import { LandingFooter } from "./footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-blue-500/20">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksLanding />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
