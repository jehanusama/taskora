"use client";

import React, { useState, useMemo } from "react";
import { Plus, FolderKanban, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { CreateProjectDialog } from "./create-project-dialog";
import { useProjects } from "@/hooks/use-projects";
import { useMembers } from "@/hooks/use-members";
import { Project, ProjectStatus } from "@/types";

export function ProjectsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError,
    refetch,
  } = useProjects();

  const { data: members = [] } = useMembers();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        search.trim() === "" ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.key.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Projects"
        description="Organize scopes, target milestones, and assign squads to delivery roadmaps."
        badge={projects.length}
      >
        <Button onClick={handleOpenCreate} className="gap-2 shadow-xs">
          <Plus className="size-4" />
          <span>New Project</span>
        </Button>
      </PageHeader>

      {/* Filters Bar */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={filteredProjects.length}
      />

      {/* Content Area: Loading / Error / Empty / Grid */}
      {projectsLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="pt-4 space-y-2 border-t border-border">
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={RefreshCw}
          title="Could not load projects"
          description="There was a temporary problem retrieving your projects. Please retry."
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={search || statusFilter !== "all" ? "No matching projects found" : "No projects yet"}
          description={
            search || statusFilter !== "all"
              ? "Try adjusting your filters or search terms to locate projects."
              : "Kickstart collaboration by creating your first project roadmap."
          }
          actionLabel={search || statusFilter !== "all" ? "Reset Filters" : "Create Project"}
          onAction={
            search || statusFilter !== "all"
              ? () => {
                  setSearch("");
                  setStatusFilter("all");
                }
              : handleOpenCreate
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={members}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectToEdit={editingProject}
        members={members}
      />
    </div>
  );
}

