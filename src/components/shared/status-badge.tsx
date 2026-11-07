import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectStatus, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, Clock, PauseCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          icon: CircleDashed,
          className: "bg-primary/15 text-primary border-primary/20",
        };
      case "completed":
      case "done":
        return {
          label: status === "done" ? "Done" : "Completed",
          icon: CheckCircle2,
          className: "bg-success/15 text-success border-success/30",
        };
      case "on_hold":
      case "archived":
        return {
          label: status === "on_hold" ? "On Hold" : "Archived",
          icon: PauseCircle,
          className: "bg-muted text-muted-foreground border-border",
        };
      case "todo":
        return {
          label: "To Do",
          icon: CircleDashed,
          className: "bg-muted text-muted-foreground border-border",
        };
      case "in_progress":
        return {
          label: "In Progress",
          icon: Clock,
          className: "bg-primary/15 text-primary border-primary/20",
        };
      case "in_review":
        return {
          label: "In Review",
          icon: Clock,
          className: "bg-accent text-accent-foreground border-accent-foreground/20",
        };
      default:
        return {
          label: status,
          icon: CircleDashed,
          className: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const { label, icon: Icon, className: variantClass } = getStatusConfig();

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium capitalize transition-colors duration-200",
        variantClass,
        className
      )}
    >
      {showIcon && <Icon className="size-3" aria-hidden="true" />}
      <span>{label}</span>
    </Badge>
  );
}

