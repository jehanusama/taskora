"use client";

import React from "react";
import { FolderKanban, CheckCircle2, AlertCircle, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats as StatsType } from "@/types";

interface DashboardStatsProps {
  stats?: StatsType;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Active Projects",
      value: stats?.activeProjects ?? 0,
      total: stats?.totalProjects ?? 0,
      subtext: `${stats?.totalProjects ?? 0} total initiatives`,
      icon: FolderKanban,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed Tasks",
      value: stats?.completedTasks ?? 0,
      total: stats?.totalTasks ?? 0,
      subtext: `${stats?.completionRate ?? 0}% overall completion`,
      icon: CheckCircle2,
      iconColor: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Due Soon / Overdue",
      value: stats?.overdueTasks ?? 0,
      total: stats?.totalTasks ?? 0,
      subtext: "Needs team focus",
      icon: AlertCircle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Team Members",
      value: stats?.teamMembersCount ?? 0,
      total: null,
      subtext: "Collaborating across squads",
      icon: Users,
      iconColor: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="group relative overflow-hidden p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-border/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </span>
              <div
                className={`flex size-9 items-center justify-center rounded-lg ${item.bgColor} ${item.iconColor}`}
              >
                <Icon className="size-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-heading">
                  {item.value}
                </span>
                {item.total !== null && (
                  <span className="text-xs text-muted-foreground">/ {item.total}</span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="size-3.5 text-primary" />
                <span>{item.subtext}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

