import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingFeatures } from "@/components/marketing/marketing-features";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20">
      <MarketingNavbar />
      <main className="flex-1">
        <MarketingHero />
        <MarketingFeatures />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

