import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { ScreenshotsSection } from "./screenshots";
import { CtaSection } from "./cta";
import { LandingFooter } from "./footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
