"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/mock-data/api";
import { Task, TaskStatus } from "@/types";
import { PROJECT_KEYS } from "./use-projects";

export const TASK_KEYS = {
  all: ["tasks"] as const,
  byProject: (projectId?: string) => [...TASK_KEYS.all, "byProject", projectId ?? "all"] as const,
  detail: (id: string) => [...TASK_KEYS.all, "detail", id] as const,
};

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: TASK_KEYS.byProject(projectId),
    queryFn: () => tasksApi.getAll(projectId),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Task, "id" | "order" | "createdAt" | "updatedAt">) =>
      tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      newStatus,
      newOrder,
    }: {
      taskId: string;
      newStatus: TaskStatus;
      newOrder: number;
    }) => tasksApi.move(taskId, newStatus, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

