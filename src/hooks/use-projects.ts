"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/mock-data/api";
import { Project } from "@/types";

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_KEYS.all, "list"] as const,
  detail: (id: string) => [...PROJECT_KEYS.all, "detail", id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: PROJECT_KEYS.lists(),
    queryFn: () => projectsApi.getAll(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => projectsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Project, "id" | "taskCount" | "completedTaskCount" | "createdAt" | "updatedAt">) =>
      projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

