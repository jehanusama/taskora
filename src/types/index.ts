export type UserRole = "admin" | "member" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  status: "active" | "invited" | "suspended";
  createdAt: string;
}

export type ProjectStatus = "active" | "completed" | "on_hold" | "archived";

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  status: ProjectStatus;
  dueDate: string;
  memberIds: string[];
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate: string;
  labels: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  order: number;
  accentClass: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetTitle: string;
  targetType: "project" | "task" | "member";
  timestamp: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembersCount: number;
  completionRate: number;
}

export interface WorkspaceSettings {
  id: string;
  name: string;
  slug: string;
  billingEmail: string;
  plan: "Free" | "Pro" | "Enterprise";
  logoUrl?: string;
  notifications: {
    emailDigest: boolean;
    taskAssignment: boolean;
    projectUpdates: boolean;
    weeklySummary: boolean;
  };
}

