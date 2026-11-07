"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import {
  Task,
  TaskStatus,
  KanbanColumn as ColumnType,
  User,
  Project,
} from "@/types";
import { kanbanColumns } from "@/lib/mock-data/initial-data";
import { useMoveTask } from "@/hooks/use-tasks";

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  members: User[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  projects,
  members,
  onAddTask,
  onEditTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTask = useMoveTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid intercepting simple clicks
      },
    })
  );

  const memberMap = React.useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );
  const projectMap = React.useMemo(
    () => new Map(projects.map((p) => [p.id, p])),
    [projects]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const activeTaskObj = tasks.find((t) => t.id === activeTaskId);
    if (!activeTaskObj) return;

    // Check if dropped directly onto a column
    const isOverColumn = kanbanColumns.some((col) => col.id === overId);

    if (isOverColumn) {
      const targetStatus = overId as TaskStatus;
      if (activeTaskObj.status !== targetStatus) {
        moveTask.mutate({
          taskId: activeTaskId,
          newStatus: targetStatus,
          newOrder: 0,
        });
      }
      return;
    }

    // Dropped onto another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      const targetStatus = overTask.status;
      const targetColumnTasks = tasks.filter((t) => t.status === targetStatus);
      const overIndex = targetColumnTasks.findIndex((t) => t.id === overId);

      if (activeTaskObj.status !== targetStatus) {
        moveTask.mutate({
          taskId: activeTaskId,
          newStatus: targetStatus,
          newOrder: Math.max(0, overIndex),
        });
      } else if (activeTaskId !== overId) {
        // Reordering within same column
        moveTask.mutate({
          taskId: activeTaskId,
          newStatus: targetStatus,
          newOrder: overIndex,
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start scrollbar-thin">
        {kanbanColumns.map((col) => {
          const columnTasks = tasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.order - b.order);

          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={columnTasks}
              members={members}
              projects={projects}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
            />
          );
        })}
      </div>

      {/* Ghost Card Overlay while Dragging */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            assignee={activeTask.assigneeId ? memberMap.get(activeTask.assigneeId) : undefined}
            project={projectMap.get(activeTask.projectId)}
            onEdit={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

