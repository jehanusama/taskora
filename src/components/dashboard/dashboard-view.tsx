"use client";

import React from "react";
import Link from "next/link";
import { Plus, Users, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "./dashboard-stats";
import { ProjectProgressCard } from "./project-progress-card";
import { UrgentTasksCard } from "./urgent-tasks-card";
import { RecentActivityCard } from "./recent-activity-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useDashboardStats, useRecentActivities } from "@/hooks/use-dashboard";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useCurrentUser } from "@/hooks/use-auth";

export function DashboardView() {
  const { data: user } = useCurrentUser();
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useTasks();

  const {
    data: activities = [],
    isLoading: activitiesLoading,
  } = useRecentActivities();

  const isAnyError = statsError || projectsError || tasksError;

  if (isAnyError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Overview"
          description="Track overall project delivery and team bandwidth"
        />
        <EmptyState
          icon={RefreshCw}
          title="Failed to load dashboard data"
          description="We encountered an issue fetching your workspace statistics. Please try refreshing."
          actionLabel="Retry Loading"
          onAction={() => {
            refetchStats();
            refetchProjects();
            refetchTasks();
          }}
        />
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header with Welcome and Quick Actions */}
      <PageHeader
        title={`${greeting()}, ${user?.name ? user.name.split(" ")[0] : "there"}! 👋`}
        description="Here is what is happening across your projects and active work streams today."
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shadow-xs"
          render={<Link href="/members" />}
          nativeButton={false}
        >
          <Users className="size-4" />
          <span>Team</span>
        </Button>
        <Button
          size="sm"
          className="gap-1.5 shadow-xs"
          render={<Link href="/projects" />}
          nativeButton={false}
        >
          <Plus className="size-4" />
          <span>New Project</span>
        </Button>
      </PageHeader>

      {/* KPI Stats Grid */}
      <DashboardStats stats={stats} isLoading={statsLoading} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectProgressCard
          projects={projects}
          isLoading={projectsLoading}
        />
        <UrgentTasksCard
          tasks={tasks}
          isLoading={tasksLoading}
        />
      </div>

      {/* Team Activity Feed */}
      <RecentActivityCard
        activities={activities}
        isLoading={activitiesLoading}
      />
    </div>
  );
}

