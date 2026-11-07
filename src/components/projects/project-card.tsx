"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MoreVertical,
  Kanban,
  Trash2,
  Edit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Project, User } from "@/types";
import { useDeleteProject } from "@/hooks/use-projects";
import { notify } from "@/lib/notify";

interface ProjectCardProps {
  project: Project;
  members: User[];
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, members, onEdit }: ProjectCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteProject = useDeleteProject();

  const progress =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  const assignedMembers = members.filter((m) =>
    project.memberIds.includes(m.id)
  );

  const handleDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        notify.success(
          "Project Deleted",
          `"${project.name}" has been removed.`
        );
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border">
        {/* Top Accent Strip */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        />

        <div>
          {/* Header Row: Key + Status + Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                style={{
                  color: project.color,
                  borderColor: `${project.color}40`,
                  backgroundColor: `${project.color}10`,
                }}
              >
                {project.key}
              </span>
              <StatusBadge status={project.status} showIcon={false} />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Project actions"
                  />
                }
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/kanban?project=${project.id}`}
                      className="flex items-center"
                    />
                  }
                >
                  <Kanban className="size-4 mr-2" />
                  <span>Open Board</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Edit className="size-4 mr-2" />
                  <span>Edit Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title & Description */}
          <div className="mt-3.5">
            <Link
              href={`/kanban?project=${project.id}`}
              className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
            >
              {project.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-8">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Bottom Section: Progress + Team + Due Date */}
        <div className="mt-5 space-y-4 pt-3 border-t border-border/60">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: project.color,
                }}
              />
            </div>
          </div>

          {/* Footer Info: Due Date + Avatars */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>{project.dueDate}</span>
            </div>

            <div className="flex -space-x-1.5 overflow-hidden">
              {assignedMembers.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  size="sm"
                  className="ring-2 ring-background border-none"
                >
                  {member.avatarUrl && (
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignedMembers.length > 3 && (
                <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
                  +{assignedMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete "${project.name}"?`}
        description="This will permanently delete this project and all associated kanban tasks. This action cannot be reversed."
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        isLoading={deleteProject.isPending}
      />
    </>
  );
}

