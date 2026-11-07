"use client";

import React, { useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { projectSchema } from "@/lib/validations/project";
import { Project, User } from "@/types";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { notify } from "@/lib/notify";
import { z } from "zod";
import { Loader2, Palette } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: Project | null;
  members: User[];
}

const COLOR_PRESETS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#6366f1", // Indigo
];

function getDefaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  projectToEdit,
  members,
}: CreateProjectDialogProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const isEditing = Boolean(projectToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof projectSchema>, unknown, z.output<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      color: COLOR_PRESETS[0],
      status: "active",
      dueDate: getDefaultDueDate(),
      memberIds: members.slice(0, 2).map((m) => m.id),
    },
  });

  const selectedColor = useWatch({ control, name: "color" });
  const selectedMembers = useWatch({ control, name: "memberIds" }) || [];

  useEffect(() => {
    if (projectToEdit) {
      reset({
        name: projectToEdit.name,
        key: projectToEdit.key,
        description: projectToEdit.description || "",
        color: projectToEdit.color,
        status: projectToEdit.status,
        dueDate: projectToEdit.dueDate,
        memberIds: projectToEdit.memberIds,
      });
    } else {
      reset({
        name: "",
        key: "",
        description: "",
        color: COLOR_PRESETS[0],
        status: "active",
        dueDate: getDefaultDueDate(),
        memberIds: members.slice(0, 2).map((m) => m.id),
      });
    }
  }, [projectToEdit, reset, members]);

  // Auto-generate key from name if new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);
    if (!isEditing && val) {
      const generated = val
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);
      if (generated) setValue("key", generated);
    }
  };

  const toggleMember = (memberId: string) => {
    const current = new Set(selectedMembers);
    if (current.has(memberId)) {
      current.delete(memberId);
    } else {
      current.add(memberId);
    }
    setValue("memberIds", Array.from(current), { shouldValidate: true });
  };

  const onSubmit = async (data: z.output<typeof projectSchema>) => {
    if (isEditing && projectToEdit) {
      await updateProject.mutateAsync({
        id: projectToEdit.id,
        data,
      });
      notify.success(
        "Project updated",
        `"${data.name}" has been updated.`
      );
    } else {
      await createProject.mutateAsync(data);
      notify.success(
        "Project created",
        `"${data.name}" is now ready!`
      );
    }
    onOpenChange(false);
  };

  const isPending = createProject.isPending || updateProject.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">
            {isEditing ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Update settings, due date, and team members for this project."
              : "Set up a new workspace initiative to organize boards, tasks, and deadlines."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Project Name & Key */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="project-name" className="text-xs font-semibold">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="e.g. NextGen Mobile App"
                {...register("name")}
                onChange={handleNameChange}
                aria-invalid={Boolean(errors.name)}
                className="h-9"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-key" className="text-xs font-semibold">
                Key <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-key"
                placeholder="MOB"
                maxLength={6}
                {...register("key")}
                onChange={(e) => setValue("key", e.target.value.toUpperCase())}
                aria-invalid={Boolean(errors.key)}
                className="h-9 uppercase font-mono"
              />
              {errors.key && (
                <p className="text-[11px] text-destructive">{errors.key.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="project-desc" className="text-xs font-semibold">
              Description
            </Label>
            <Textarea
              id="project-desc"
              rows={2}
              placeholder="What are the goals and deliverables for this project?"
              {...register("description")}
              className="resize-none text-xs"
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="project-status" className="text-xs font-semibold">
                Status
              </Label>
              <select
                id="project-status"
                {...register("status")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-due" className="text-xs font-semibold">
                Target Delivery Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-due"
                type="date"
                {...register("dueDate")}
                className="h-9 text-xs"
              />
              {errors.dueDate && (
                <p className="text-[11px] text-destructive">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Theme Color Presets */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Palette className="size-3.5 text-primary" />
              Accent Color
            </Label>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`size-7 rounded-full border-2 transition-transform duration-150 hover:scale-110 ${
                    selectedColor === color ? "border-foreground ring-2 ring-primary ring-offset-2" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Team Assignment */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Assign Team Members <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 rounded-md border border-border">
              {members.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-md border text-left transition-colors duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-transparent hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Avatar size="sm">
                      {member.avatarUrl && (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {member.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate capitalize">
                        {member.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.memberIds && (
              <p className="text-[11px] text-destructive">{errors.memberIds.message}</p>
            )}
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
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

