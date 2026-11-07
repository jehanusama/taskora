"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "@/lib/mock-data/api";
import { UserRole } from "@/types";

export const MEMBER_KEYS = {
  all: ["members"] as const,
  list: () => [...MEMBER_KEYS.all, "list"] as const,
};

export function useMembers() {
  return useQuery({
    queryKey: MEMBER_KEYS.list(),
    queryFn: () => membersApi.getAll(),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; role: UserRole; department: string }) =>
      membersApi.invite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      membersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.all });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

