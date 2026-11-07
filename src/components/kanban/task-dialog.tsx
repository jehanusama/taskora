"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { taskSchema } from "@/lib/validations/task";
import { Task, TaskStatus, Project, User } from "@/types";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { notify } from "@/lib/notify";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
  projects: Project[];
  members: User[];
}

const COMMON_TAGS = ["Frontend", "Backend", "UI/UX", "Bug", "Feature", "Security", "DevOps"];

function getDefaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

export function TaskDialog({
  open,
  onOpenChange,
  taskToEdit,
  defaultStatus = "todo",
  defaultProjectId,
  projects,
  members,
}: TaskDialogProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = Boolean(taskToEdit);

  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof taskSchema>, unknown, z.output<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: defaultProjectId || projects[0]?.id || "",
      status: defaultStatus,
      priority: "medium",
      assigneeId: "",
      dueDate: getDefaultDueDate(),
      labels: [],
    },
  });

  const selectedLabels = useWatch({ control, name: "labels" }) || [];

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        projectId: taskToEdit.projectId,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assigneeId: taskToEdit.assigneeId || "",
        dueDate: taskToEdit.dueDate,
        labels: taskToEdit.labels || [],
      });
    } else {
      reset({
        title: "",
        description: "",
        projectId: defaultProjectId || projects[0]?.id || "",
        status: defaultStatus,
        priority: "medium",
        assigneeId: "",
        dueDate: getDefaultDueDate(),
        labels: [],
      });
    }
  }, [taskToEdit, defaultStatus, defaultProjectId, projects, reset]);

  const handleAddTag = (tag: string) => {
    const cleanTag = tag.trim();
    if (!cleanTag) return;
    if (!selectedLabels.includes(cleanTag)) {
      setValue("labels", [...selectedLabels, cleanTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "labels",
      selectedLabels.filter((l) => l !== tagToRemove)
    );
  };

  const onSubmit = async (data: z.output<typeof taskSchema>) => {
    if (isEditing && taskToEdit) {
      await updateTask.mutateAsync({
        id: taskToEdit.id,
        data,
      });
      notify.success(
        "Task Updated",
        `"${data.title}" has been saved.`
      );
    } else {
      await createTask.mutateAsync(data);
      notify.success(
        "Task Created",
        `"${data.title}" added to the board.`
      );
    }
    onOpenChange(false);
  };

  const isPending = createTask.isPending || updateTask.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">
            {isEditing ? "Edit Task Details" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Update status, priority, due date, and assignees."
              : "Add an actionable item to your team's kanban pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Implement biometric authorization flow"
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
              className="h-9"
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Project & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-project" className="text-xs font-semibold">
                Project <span className="text-destructive">*</span>
              </Label>
              <select
                id="task-project"
                {...register("projectId")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.key}] {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-[11px] text-destructive">{errors.projectId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-status" className="text-xs font-semibold">
                Stage / Column
              </Label>
              <select
                id="task-status"
                {...register("status")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-priority" className="text-xs font-semibold">
                Priority
              </Label>
              <select
                id="task-priority"
                {...register("priority")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-assignee" className="text-xs font-semibold">
                Assignee
              </Label>
              <select
                id="task-assignee"
                {...register("assigneeId")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.department || m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label htmlFor="task-due" className="text-xs font-semibold">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-due"
              type="date"
              {...register("dueDate")}
              className="h-9 text-xs"
            />
            {errors.dueDate && (
              <p className="text-[11px] text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-xs font-semibold">
              Description
            </Label>
            <Textarea
              id="task-desc"
              rows={3}
              placeholder="Provide context, acceptance criteria, or links..."
              {...register("description")}
              className="resize-none text-xs"
            />
          </div>

          {/* Labels & Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Tags & Labels</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedLabels.map((lbl) => (
                <Badge
                  key={lbl}
                  variant="secondary"
                  className="gap-1 px-2 py-0.5 text-xs"
                >
                  {lbl}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(lbl)}
                    aria-label={`Remove tag ${lbl}`}
                    className="hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add custom tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                className="h-8 text-xs flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(tagInput)}
                className="h-8 text-xs gap-1"
              >
                <Plus className="size-3.5" /> Add
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Suggested:</span>
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

