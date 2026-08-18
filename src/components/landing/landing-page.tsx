import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { PartnersSection } from "./partners";
import { FeaturesSection } from "./features";
import { HowItWorksLanding } from "./how-it-works-landing";
import { CtaSection } from "./cta";
import { LandingFooter } from "./footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-blue-500/30">
      <LandingNavbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
        <HowItWorksLanding />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
