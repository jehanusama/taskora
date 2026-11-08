"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Project } from "@/types";
import { routes, DEFAULT_WORKSPACE } from "@/config/routes";

interface ProjectProgressCardProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectProgressCard({ projects, isLoading }: ProjectProgressCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs transition-all duration-200 hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Project Delivery</CardTitle>
          <CardDescription className="text-xs">
            Milestones and task completion rates
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          render={<Link href={routes.projects(DEFAULT_WORKSPACE)} />}
          nativeButton={false}
        >
          View All <ArrowUpRight className="size-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No active projects. Click &ldquo;New Project&rdquo; to begin.
          </div>
        ) : (
          projects.slice(0, 4).map((project) => {
            const progress =
              project.taskCount > 0
                ? Math.round((project.completedTaskCount / project.taskCount) * 100)
                : 0;

            return (
              <div
                key={project.id}
                className="group rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: project.color }}
                      aria-hidden="true"
                    />
                    <Link
                      href={routes.projects(DEFAULT_WORKSPACE)}
                      className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors"
                    >
                      {project.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={project.status} showIcon={false} />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {progress}%
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {project.completedTaskCount} of {project.taskCount} tasks closed
                  </span>
                  <Link
                    href={routes.board(DEFAULT_WORKSPACE, project.id)}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Open Kanban &rarr;
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

