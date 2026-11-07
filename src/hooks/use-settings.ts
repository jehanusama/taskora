"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/mock-data/api";
import { WorkspaceSettings } from "@/types";

export const SETTINGS_KEYS = {
  workspace: ["settings", "workspace"] as const,
};

export function useWorkspaceSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.workspace,
    queryFn: () => settingsApi.getWorkspace(),
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkspaceSettings>) =>
      settingsApi.updateWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.workspace });
    },
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceSettings["notifications"]) =>
      settingsApi.updateNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.workspace });
    },
  });
}

