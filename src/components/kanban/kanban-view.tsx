"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Kanban, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { KanbanBoard } from "./kanban-board";
import { KanbanFilters } from "./kanban-filters";
import { TaskDialog } from "./task-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { useMembers } from "@/hooks/use-members";
import { Task, TaskStatus, TaskPriority } from "@/types";

export function KanbanView() {
  const searchParams = useSearchParams();
  const urlProject = searchParams.get("project");

  const [selectedProjectId, setSelectedProjectId] = useState<string>(urlProject || "all");
  const [prevUrlProject, setPrevUrlProject] = useState(urlProject);

  if (prevUrlProject !== urlProject) {
    setPrevUrlProject(urlProject);
    setSelectedProjectId(urlProject || "all");
  }

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumn, setTargetColumn] = useState<TaskStatus>("todo");

  const {
    data: allTasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useTasks();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects();

  const { data: members = [] } = useMembers();

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      // Project filter
      if (selectedProjectId !== "all" && task.projectId !== selectedProjectId) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      // Assignee filter
      if (assigneeFilter !== "all") {
        if (assigneeFilter === "unassigned" && task.assigneeId) return false;
        if (assigneeFilter !== "unassigned" && task.assigneeId !== assigneeFilter) return false;
      }

      // Text search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || "").toLowerCase().includes(query);
        const matchesLabel = (task.labels || []).some((l) => l.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesLabel) return false;
      }

      return true;
    });
  }, [allTasks, selectedProjectId, priorityFilter, assigneeFilter, search]);

  const handleOpenAddTask = (status: TaskStatus = "todo") => {
    setEditingTask(null);
    setTargetColumn(status);
    setTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setSelectedProjectId("all");
  };

  const isLoading = tasksLoading || projectsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Kanban Board"
        description="Visualize workflow bottlenecks, organize task stages, and drag cards to update progress."
        badge={filteredTasks.length}
      >
        <Button onClick={() => handleOpenAddTask("todo")} className="gap-2 shadow-xs">
          <Plus className="size-4" />
          <span>New Task</span>
        </Button>
      </PageHeader>

      {/* Filter Toolbar */}
      <KanbanFilters
        projects={projects}
        members={members}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Main Board View: Loading / Error / Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-80 shrink-0 space-y-3 rounded-2xl border border-border p-3 bg-muted/20">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="size-5 rounded-full" />
              </div>
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : tasksError || projectsError ? (
        <EmptyState
          icon={RefreshCw}
          title="Could not load Kanban Board"
          description="Failed to load tasks and columns from the workspace. Please retry."
          actionLabel="Retry Loading"
          onAction={() => refetchTasks()}
        />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Kanban}
          title="No projects available for the Kanban board"
          description="Create a project first before organizing task columns and milestones."
          actionLabel="Create First Project"
          onAction={() => {}}
        />
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          projects={projects}
          members={members}
          onAddTask={handleOpenAddTask}
          onEditTask={handleOpenEditTask}
        />
      )}

      {/* Create / Edit Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        taskToEdit={editingTask}
        defaultStatus={targetColumn}
        defaultProjectId={selectedProjectId !== "all" ? selectedProjectId : undefined}
        projects={projects}
        members={members}
      />
    </div>
  );
}

