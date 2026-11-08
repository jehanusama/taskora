import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { routes, DEFAULT_WORKSPACE } from "@/config/routes";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Subtle glow backdrop */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-3xl opacity-50 dark:opacity-20" />

      <div className="container mx-auto px-6 max-w-5xl text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground shadow-xs">
          <Badge variant="default" className="text-[10px] h-4 px-1.5 font-semibold">
            New
          </Badge>
          <span>Vega Design System & Next.js 15+ Enabled</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-heading leading-tight max-w-4xl mx-auto">
          Plan, execute, and deliver with{" "}
          <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
            {siteConfig.name}
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-xl leading-relaxed">
          The high-velocity project management platform built for modern engineering and product teams.
          Interactive Kanban, automated tracking, and delightful micro-interactions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            className="h-11 px-8 gap-2 shadow-sm font-semibold text-base w-full sm:w-auto"
            render={<Link href={routes.dashboard()} />}
            nativeButton={false}
          >
            Launch Demo Workspace <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-11 px-8 text-base w-full sm:w-auto"
            render={<Link href={routes.board(DEFAULT_WORKSPACE, "prj-1")} />}
            nativeButton={false}
          >
            View Live Kanban Board
          </Button>
        </div>

        {/* Quick trust metrics */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-success" /> Drag & Drop by @dnd-kit
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-success" /> Light & Dark Theme Support
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-success" /> Zero Backend Dependencies (Mock API)
          </span>
        </div>
      </div>
    </section>
  );
}
