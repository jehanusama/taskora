import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export function MarketingCta() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-6 max-w-4xl space-y-6">
        <h2 className="text-3xl font-bold font-heading">Ready to see it in action?</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Explore the full interactive application without needing to create an account or set up a database.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            className="h-11 px-8 gap-2 font-semibold"
            render={<Link href={routes.dashboard()} />}
            nativeButton={false}
          >
            Enter {siteConfig.name} <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
