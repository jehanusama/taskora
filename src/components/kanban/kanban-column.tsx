"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./kanban-card";
import { Task, TaskStatus, KanbanColumn as ColumnType, User, Project } from "@/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: ColumnType;
  tasks: Task[];
  members: User[];
  projects: Project[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({
  column,
  tasks,
  members,
  projects,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const memberMap = React.useMemo(() => {
    return new Map(members.map((m) => [m.id, m]));
  }, [members]);

  const projectMap = React.useMemo(() => {
    return new Map(projects.map((p) => [p.id, p]));
  }, [projects]);

  const taskIds = React.useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-80 shrink-0 rounded-2xl border border-border/70 bg-muted/30 p-3 transition-colors duration-200",
        isOver && "ring-2 ring-primary/40 bg-muted/60"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("size-2.5 rounded-full", column.accentClass)} />
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {column.title}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 px-1.5 text-xs font-semibold rounded-full"
          >
            {tasks.length}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.title}`}
          className="hover:bg-card hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Task List / Drop Zone */}
      <div className="flex flex-1 flex-col gap-2.5 min-h-64 overflow-y-auto pr-0.5">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              assignee={task.assigneeId ? memberMap.get(task.assigneeId) : undefined}
              project={projectMap.get(task.projectId)}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask(column.id)}
            className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground hover:bg-card/40 hover:border-primary/40 cursor-pointer transition-colors"
          >
            <p>No tasks yet</p>
            <span className="mt-1 text-[11px] text-primary font-medium">
              + Add first task
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

