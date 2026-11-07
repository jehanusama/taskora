"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project, User, TaskPriority } from "@/types";

interface KanbanFiltersProps {
  projects: Project[];
  members: User[];
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: TaskPriority | "all";
  onPriorityFilterChange: (priority: TaskPriority | "all") => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (id: string) => void;
  onResetFilters: () => void;
}

export function KanbanFilters({
  projects,
  members,
  selectedProjectId,
  onProjectChange,
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  onResetFilters,
}: KanbanFiltersProps) {
  const hasActiveFilters =
    search !== "" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project Selector & Search */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Project Switcher */}
          <div className="w-48 sm:w-56">
            <select
              value={selectedProjectId}
              onChange={(e) => onProjectChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Projects (Global Board)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search tasks by title, tag..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-8 pr-3 text-xs bg-muted/40 focus:bg-background"
            />
          </div>
        </div>

        {/* Right: Quick dropdown filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | "all")}
            className="h-9 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => onAssigneeFilterChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

