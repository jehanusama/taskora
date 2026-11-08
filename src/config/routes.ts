export const DEFAULT_WORKSPACE = "acme";

export const routes = {
  // Static / Auth
  home: () => "/",
  login: () => "/login",
  register: () => "/register",
  forgotPassword: () => "/forgot-password",
  resetPassword: () => "/reset-password",
  verifyEmail: () => "/verify-email",
  onboarding: () => "/onboarding",
  acceptInvite: (token: string) => `/invite/${token}`,

  // Workspace-scoped
  dashboard: (ws: string = DEFAULT_WORKSPACE) => `/${ws}/dashboard`,
  projects: (ws: string = DEFAULT_WORKSPACE) => `/${ws}/projects`,
  project: (ws: string = DEFAULT_WORKSPACE, id: string) => `/${ws}/projects/${id}`,
  board: (ws: string = DEFAULT_WORKSPACE, id: string) => `/${ws}/projects/${id}/board`,
  list: (ws: string = DEFAULT_WORKSPACE, id: string) => `/${ws}/projects/${id}/list`,
  members: (ws: string = DEFAULT_WORKSPACE) => `/${ws}/members`,
  settings: (ws: string = DEFAULT_WORKSPACE) => `/${ws}/settings`,
  notifications: (ws: string = DEFAULT_WORKSPACE) => `/${ws}/notifications`,
} as const;
