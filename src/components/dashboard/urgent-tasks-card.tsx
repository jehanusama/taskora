"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { Task } from "@/types";
import { useUpdateTask } from "@/hooks/use-tasks";
import { notify } from "@/lib/notify";
import { routes, DEFAULT_WORKSPACE } from "@/config/routes";

interface UrgentTasksCardProps {
  tasks: Task[];
  isLoading: boolean;
}

export function UrgentTasksCard({ tasks, isLoading }: UrgentTasksCardProps) {
  const updateTask = useUpdateTask();

  const handleToggleTask = (task: Task) => {
    const nextStatus = task.status === "done" ? "todo" : "done";
    updateTask.mutate(
      { id: task.id, data: { status: nextStatus } },
      {
        onSuccess: () => {
          notify.success(
            nextStatus === "done" ? "Task Completed!" : "Task Reopened",
            task.title
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="size-5 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter urgent/high or pending tasks
  const urgentTasks = tasks
    .filter((t) => t.status !== "done")
    .sort((a) => (a.priority === "urgent" ? -1 : 1))
    .slice(0, 5);

  return (
    <Card className="shadow-xs transition-all duration-200 hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Priority Action Items</CardTitle>
          <CardDescription className="text-xs">
            Tasks requiring immediate attention
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          render={<Link href={routes.projects(DEFAULT_WORKSPACE)} />}
          nativeButton={false}
        >
          Board <ArrowUpRight className="size-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {urgentTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <CheckCircle2 className="size-8 text-success" />
            <span>All high-priority tasks are completed! Good job.</span>
          </div>
        ) : (
          urgentTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
            >
              <button
                type="button"
                onClick={() => handleToggleTask(task)}
                className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded border border-input transition-colors hover:border-primary hover:bg-primary/10"
                aria-label={`Mark ${task.title} as completed`}
              >
                {task.status === "done" && (
                  <CheckCircle2 className="size-4 text-success fill-success" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {task.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    Due {task.dueDate}
                  </span>
                  <span>&bull;</span>
                  <PriorityBadge priority={task.priority} showIcon={false} />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

