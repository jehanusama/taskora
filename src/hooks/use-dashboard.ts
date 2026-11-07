"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/mock-data/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: () => dashboardApi.getActivities(),
  });
}

