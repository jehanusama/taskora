"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  MoreHorizontal,
  Edit2,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Task, User, Project } from "@/types";
import { useDeleteTask } from "@/hooks/use-tasks";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  task: Task;
  assignee?: User;
  project?: Project;
  onEdit: (task: Task) => void;
  isOverlay?: boolean;
}

export function KanbanCard({
  task,
  assignee,
  project,
  onEdit,
  isOverlay = false,
}: KanbanCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteTask = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        notify.success(
          "Task Deleted",
          `"${task.title}" has been deleted.`
        );
        setDeleteDialogOpen(false);
      },
    });
  };

  const isOverdue =
    task.status !== "done" &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "touch-none select-none",
          isDragging && "opacity-30 scale-95"
        )}
      >
        <Card
          className={cn(
            "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-border cursor-grab active:cursor-grabbing",
            isOverlay && "rotate-2 shadow-xl ring-2 ring-primary border-primary",
            task.status === "done" && "bg-card/60"
          )}
        >
          {/* Card Top: Drag Handle, Project Tag, Priority, Actions */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
                aria-label="Drag task handle"
              >
                <GripVertical className="size-3.5" />
              </button>

              {project && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase truncate"
                  style={{
                    backgroundColor: `${project.color}15`,
                    color: project.color,
                  }}
                >
                  {project.key}
                </span>
              )}

              <PriorityBadge priority={task.priority} showIcon={false} />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Task options"
                  />
                }
              >
                <MoreHorizontal className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="size-3.5 mr-2" />
                  <span>Edit Task</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-2" />
                  <span>Delete Task</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title & Description */}
          <div
            onClick={() => onEdit(task)}
            className="mt-2.5 cursor-pointer"
          >
            <h4
              className={cn(
                "text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug",
                task.status === "done" && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {task.labels.map((lbl) => (
                <Badge
                  key={lbl}
                  variant="secondary"
                  className="h-4 px-1.5 py-0 text-[10px] font-normal"
                >
                  {lbl}
                </Badge>
              ))}
            </div>
          )}

          {/* Card Footer: Due Date + Assignee */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
            <div
              className={cn(
                "flex items-center gap-1 font-medium",
                isOverdue
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <Calendar className="size-3" />
              <span>{task.dueDate}</span>
            </div>

            {assignee ? (
              <div
                className="flex items-center gap-1.5"
                title={`Assigned to ${assignee.name}`}
              >
                <Avatar size="sm" className="size-5 ring-1 ring-border">
                  {assignee.avatarUrl && (
                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                  )}
                  <AvatarFallback className="text-[9px]">
                    {assignee.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground italic">
                Unassigned
              </span>
            )}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete this task?"
        description={`"${task.title}" will be permanently removed.`}
        confirmLabel="Delete Task"
        onConfirm={handleDelete}
        isLoading={deleteTask.isPending}
      />
    </>
  );
}

