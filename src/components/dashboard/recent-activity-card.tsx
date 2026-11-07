"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "@/types";

interface RecentActivityCardProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecentActivityCard({ activities, isLoading }: RecentActivityCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-2 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs transition-all duration-200 hover:shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Team Pulse</CardTitle>
        <CardDescription className="text-xs">
          Real-time activity audit trail across your team
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-1">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="relative pl-3 space-y-4 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-3 text-xs">
                <Avatar size="sm" className="ring-2 ring-background z-10 shrink-0">
                  {activity.userAvatar && (
                    <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {activity.userName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-foreground">
                    <strong className="font-semibold">{activity.userName}</strong>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium text-foreground">
                      &ldquo;{activity.targetTitle}&rdquo;
                    </span>
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

