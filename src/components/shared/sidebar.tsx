"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { routes, DEFAULT_WORKSPACE } from "@/config/routes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Sparkles,
  ChevronRight,
  X,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-auth";
import { useWorkspaceSettings } from "@/hooks/use-settings";

interface SidebarProps {
  onMobileClose?: () => void;
  className?: string;
}

export function Sidebar({ onMobileClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const { data: workspace } = useWorkspaceSettings();

  const currentWs = workspace?.slug || DEFAULT_WORKSPACE;

  const navItems = [
    {
      label: "Dashboard",
      href: routes.dashboard(currentWs),
      icon: LayoutDashboard,
      active: pathname.startsWith(routes.dashboard(currentWs)),
    },
    {
      label: "Projects",
      href: routes.projects(currentWs),
      icon: FolderKanban,
      active: pathname.startsWith(routes.projects(currentWs)),
    },
    {
      label: "Team Members",
      href: routes.members(currentWs),
      icon: Users,
      active: pathname.startsWith(routes.members(currentWs)),
    },
    {
      label: "Settings",
      href: routes.settings(currentWs),
      icon: Settings,
      active: pathname.startsWith(routes.settings(currentWs)),
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {/* Brand & Workspace Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Link
          href={routes.dashboard(currentWs)}
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-5" />
          </div>
          <span className="text-xl font-heading font-extrabold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close sidebar navigation"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Workspace Switcher Card */}
      <div className="p-3">
        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2.5 transition-colors duration-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">
                {workspace?.name || "Taskora Workspace"}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="h-4 px-1 text-[10px] uppercase font-bold">
                  {workspace?.plan || "Pro"}
                </Badge>
                <span className="text-[10px] text-muted-foreground truncate">
                  {workspace?.slug || "org"}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-2" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4.5 transition-colors duration-200",
                  item.active
                    ? "text-primary"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                )}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile section */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href={routes.settings(currentWs)}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-sidebar-accent/60"
        >
          <Avatar size="default" className="border border-border">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="text-xs font-semibold">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {user?.name || "User"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.email || "user@taskora.io"}
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
            {user?.role || "admin"}
          </Badge>
        </Link>
      </div>
    </aside>
  );
}

