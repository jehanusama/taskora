import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskPriority } from "@/types";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({
  priority,
  className,
  showIcon = true,
}: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case "urgent":
        return {
          label: "Urgent",
          icon: AlertCircle,
          className: "bg-destructive/15 text-destructive border-destructive/30",
        };
      case "high":
        return {
          label: "High",
          icon: AlertTriangle,
          className: "bg-destructive/10 text-destructive border-destructive/20",
        };
      case "medium":
        return {
          label: "Medium",
          icon: ArrowUp,
          className: "bg-primary/10 text-primary border-primary/20",
        };
      case "low":
        return {
          label: "Low",
          icon: ArrowDown,
          className: "bg-muted text-muted-foreground border-border",
        };
      default:
        return {
          label: priority,
          icon: ArrowDown,
          className: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const { label, icon: Icon, className: variantClass } = getPriorityConfig();

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

