import Link from "next/link";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { routes, DEFAULT_WORKSPACE } from "@/config/routes";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="font-semibold text-foreground">{siteConfig.name}</span>
          <span>&bull; Production Project Management SaaS</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href={routes.dashboard(DEFAULT_WORKSPACE)} className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href={routes.projects(DEFAULT_WORKSPACE)} className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href={routes.board(DEFAULT_WORKSPACE, "prj-1")} className="hover:text-foreground transition-colors">
            Kanban
          </Link>
          <Link href={routes.members(DEFAULT_WORKSPACE)} className="hover:text-foreground transition-colors">
            Team
          </Link>
          <Link href={routes.settings(DEFAULT_WORKSPACE)} className="hover:text-foreground transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
