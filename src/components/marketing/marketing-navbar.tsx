import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-6 backdrop-blur-md">
      <Link href={routes.home()} className="flex items-center gap-2.5 font-bold tracking-tight">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Sparkles className="size-5" />
        </div>
        <span className="text-xl font-heading font-extrabold tracking-tight">
          {siteConfig.name}
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={routes.login()} />}
          nativeButton={false}
        >
          Sign In
        </Button>
        <Button
          size="sm"
          className="gap-1.5 shadow-xs"
          render={<Link href={routes.dashboard()} />}
          nativeButton={false}
        >
          Enter Workspace <ArrowRight className="size-4" />
        </Button>
      </div>
    </header>
  );
}
