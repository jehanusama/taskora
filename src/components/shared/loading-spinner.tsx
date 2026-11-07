import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  label?: string;
}

export function LoadingSpinner({
  size = "default",
  label = "Loading...",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    default: "size-6",
    lg: "size-8",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center gap-2 text-muted-foreground", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

