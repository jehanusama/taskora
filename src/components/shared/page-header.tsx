import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between border-b border-border/60",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
            {title}
          </h1>
          {badge !== undefined && (
            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          {children}
        </div>
      )}
    </div>
  );
}

