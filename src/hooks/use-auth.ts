"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/mock-data/api";
import { User } from "@/types";

export const AUTH_KEYS = {
  currentUser: ["auth", "currentUser"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authApi.getCurrentUser(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => authApi.login(email),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, email }: { name: string; email: string }) =>
      authApi.register(name, email),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
      queryClient.invalidateQueries();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

