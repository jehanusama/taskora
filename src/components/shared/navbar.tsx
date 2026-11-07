"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Check,
  User as UserIcon,
  Settings,
  LogOut,
  FolderKanban,
  Kanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRecentActivities } from "@/hooks/use-dashboard";
import { notify } from "@/lib/notify";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: activities = [] } = useRecentActivities();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    notify.info(
      "Signed out",
      "You have been safely signed out."
    );
    router.push("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md transition-colors duration-200 sm:px-6">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileMenu}
          className="lg:hidden"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Global Search form */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, tasks, members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-3 text-sm bg-muted/40 focus:bg-background transition-colors duration-200"
          />
        </form>
      </div>

      {/* Right: Quick Actions, Notifications, ThemeToggle & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="sm" className="gap-1.5 shadow-xs" />}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/projects")}>
              <FolderKanban className="size-4 mr-2 text-primary" />
              <span>New Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/kanban")}>
              <Kanban className="size-4 mr-2 text-primary" />
              <span>New Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/members")}>
              <UserIcon className="size-4 mr-2 text-primary" />
              <span>Invite Teammate</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="View notifications"
              />
            }
          >
            <Bell className="size-4.5" />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-3.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {activities.length} new
                </Badge>
              </div>
              <button
                type="button"
                onClick={() =>
                  notify.success("Marked all as read")
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Check className="size-3" /> Mark read
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {activities.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No notifications yet.
                </div>
              ) : (
                activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-2.5 p-3 hover:bg-muted/40 transition-colors"
                  >
                    <Avatar size="sm" className="mt-0.5">
                      {act.userAvatar && <AvatarImage src={act.userAvatar} alt={act.userName} />}
                      <AvatarFallback className="text-[10px]">
                        {act.userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <strong className="font-semibold">{act.userName}</strong>{" "}
                        {act.action}{" "}
                        <span className="font-medium text-primary">
                          &ldquo;{act.targetTitle}&rdquo;
                        </span>
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-border p-2 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-primary font-medium hover:underline"
              >
                View all notifications in Dashboard
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User account menu"
              />
            }
          >
            <Avatar size="default" className="border border-border cursor-pointer hover:opacity-90 transition-opacity">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="size-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/members")}>
                <UserIcon className="size-4 mr-2" />
                <span>Team & Roles</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="size-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

