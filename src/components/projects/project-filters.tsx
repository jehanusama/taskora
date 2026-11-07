"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | "all";
  onStatusFilterChange: (status: ProjectStatus | "all") => void;
}

export function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ProjectFiltersProps) {
  const tabs: { label: string; value: ProjectStatus | "all" }[] = [
    { label: "All Projects", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "On Hold", value: "on_hold" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Filter by name or key..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-8 text-sm bg-card"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

