import React from "react";
import { LucideIcon, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center transition-all duration-200 sm:p-12",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-8 ring-muted/20">
        <Icon className="size-7 text-primary" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} className="gap-2 shadow-sm">
            {ActionIcon && <ActionIcon className="size-4" aria-hidden="true" />}
            {actionLabel}
          </Button>
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

