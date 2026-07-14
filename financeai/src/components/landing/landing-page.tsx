"use client";

import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { HowItWorksSection } from "./how-it-works";
import { ComparisonSection } from "./comparison";
import { ScreenshotsSection } from "./screenshots";
import { CtaSection } from "./cta";
import { LandingFooter } from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <ScreenshotsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
