import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Kanban,
  CheckCircle2,
  FolderKanban,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const features = [
    {
      icon: Kanban,
      title: "Interactive Kanban Boards",
      description: "Drag-and-drop tasks seamlessly across stages with fluid micro-interactions and priority tags.",
    },
    {
      icon: FolderKanban,
      title: "Initiative & Project Tracking",
      description: "Monitor milestones, delivery timelines, and squad bandwidth in unified project cards.",
    },
    {
      icon: Users,
      title: "Role-Based Team Access",
      description: "Delegate tasks with granular Admin, Member, and Viewer permissions for airtight security.",
    },
    {
      icon: Zap,
      title: "Sub-Second State Sync",
      description: "TanStack Query caching ensures snappy UI updates and optimistic state mutations.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-6 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-5" />
          </div>
          <span className="text-xl font-heading font-extrabold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-xs">
            <Link href="/dashboard">
              Enter Workspace <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
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
              <Button asChild size="lg" className="h-11 px-8 gap-2 shadow-sm font-semibold text-base w-full sm:w-auto">
                <Link href="/dashboard">
                  Launch Demo Workspace <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-8 text-base w-full sm:w-auto">
                <Link href="/kanban">View Live Kanban Board</Link>
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

        {/* Feature Cards Grid */}
        <section className="py-16 bg-muted/20 border-y border-border/60">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                Everything required to ship on schedule
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Carefully crafted components, semantic design tokens, and smooth user experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <Card
                    key={idx}
                    className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1.5">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive Callout */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold font-heading">Ready to see it in action?</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Explore the full interactive application without needing to create an account or set up a database.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-8 gap-2 font-semibold">
                <Link href="/dashboard">
                  Enter {siteConfig.name} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-semibold text-foreground">{siteConfig.name}</span>
            <span>&bull; Production Project Management SaaS</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/kanban" className="hover:text-foreground transition-colors">
              Kanban
            </Link>
            <Link href="/members" className="hover:text-foreground transition-colors">
              Team
            </Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
