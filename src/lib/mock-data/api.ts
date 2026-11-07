import {
  User,
  Project,
  Task,
  Activity,
  WorkspaceSettings,
  DashboardStats,
  TaskStatus,
  UserRole,
} from "@/types";
import {
  initialMembers,
  initialProjects,
  initialTasks,
  initialActivities,
  initialWorkspace,
} from "./initial-data";

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe client-side storage
const STORAGE_KEYS = {
  MEMBERS: "taskora_members",
  PROJECTS: "taskora_projects",
  TASKS: "taskora_tasks",
  ACTIVITIES: "taskora_activities",
  WORKSPACE: "taskora_workspace",
  CURRENT_USER: "taskora_current_user",
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// In-memory singletons initialized from localStorage if available
let members: User[] = getFromStorage(STORAGE_KEYS.MEMBERS, initialMembers);
let projects: Project[] = getFromStorage(STORAGE_KEYS.PROJECTS, initialProjects);
let tasks: Task[] = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);
let activities: Activity[] = getFromStorage(STORAGE_KEYS.ACTIVITIES, initialActivities);
let workspace: WorkspaceSettings = getFromStorage(STORAGE_KEYS.WORKSPACE, initialWorkspace);
let currentUser: User = getFromStorage(STORAGE_KEYS.CURRENT_USER, initialMembers[0]);

function logActivity(
  action: string,
  targetTitle: string,
  targetType: "project" | "task" | "member"
) {
  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatarUrl,
    action,
    targetTitle,
    targetType,
    timestamp: "Just now",
  };
  activities = [newActivity, ...activities.slice(0, 20)];
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
}

// --- Projects API ---
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    await delay(550);
    return [...projects];
  },

  async getById(id: string): Promise<Project> {
    await delay(450);
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error(`Project with ID ${id} not found.`);
    return { ...project };
  },

  async create(input: Omit<Project, "id" | "taskCount" | "completedTaskCount" | "createdAt" | "updatedAt">): Promise<Project> {
    await delay(650);
    const newProject: Project = {
      ...input,
      id: `prj-${Date.now().toString(36)}`,
      taskCount: 0,
      completedTaskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects = [newProject, ...projects];
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    logActivity("created project", newProject.name, "project");
    return newProject;
  },

  async update(id: string, input: Partial<Project>): Promise<Project> {
    await delay(500);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updated = {
      ...projects[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updated;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    logActivity("updated project", updated.name, "project");
    return updated;
  },

  async delete(id: string): Promise<string> {
    await delay(600);
    const proj = projects.find((p) => p.id === id);
    projects = projects.filter((p) => p.id !== id);
    // Also remove associated tasks
    tasks = tasks.filter((t) => t.projectId !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    if (proj) logActivity("deleted project", proj.name, "project");
    return id;
  },
};

// --- Tasks API ---
export const tasksApi = {
  async getAll(projectId?: string): Promise<Task[]> {
    await delay(500);
    if (projectId) {
      return tasks.filter((t) => t.projectId === projectId);
    }
    return [...tasks];
  },

  async getById(id: string): Promise<Task> {
    await delay(400);
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task with ID ${id} not found.`);
    return { ...task };
  },

  async create(input: Omit<Task, "id" | "order" | "createdAt" | "updatedAt">): Promise<Task> {
    await delay(600);
    const columnTasks = tasks.filter(
      (t) => t.projectId === input.projectId && t.status === input.status
    );
    const newTask: Task = {
      ...input,
      id: `tsk-${Date.now().toString(36)}`,
      order: columnTasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks = [newTask, ...tasks];
    saveToStorage(STORAGE_KEYS.TASKS, tasks);

    // Update project stats
    const project = projects.find((p) => p.id === input.projectId);
    if (project) {
      project.taskCount += 1;
      if (input.status === "done") project.completedTaskCount += 1;
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    }

    logActivity("created task", newTask.title, "task");
    return newTask;
  },

  async update(id: string, input: Partial<Task>): Promise<Task> {
    await delay(500);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const oldTask = tasks[index];
    const updated: Task = {
      ...oldTask,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    tasks[index] = updated;
    saveToStorage(STORAGE_KEYS.TASKS, tasks);

    // Update project stats if status changed
    if (input.status && input.status !== oldTask.status) {
      const project = projects.find((p) => p.id === updated.projectId);
      if (project) {
        if (input.status === "done" && oldTask.status !== "done") {
          project.completedTaskCount += 1;
        } else if (input.status !== "done" && oldTask.status === "done") {
          project.completedTaskCount = Math.max(0, project.completedTaskCount - 1);
        }
        saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      }
    }

    logActivity("updated task", updated.title, "task");
    return updated;
  },

  async move(taskId: string, newStatus: TaskStatus, newOrder: number): Promise<Task> {
    // Faster delay for smooth drag & drop feedback
    await delay(250);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const oldStatus = task.status;
    task.status = newStatus;
    task.order = newOrder;
    task.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.TASKS, tasks);

    if (oldStatus !== newStatus) {
      const project = projects.find((p) => p.id === task.projectId);
      if (project) {
        if (newStatus === "done" && oldStatus !== "done") {
          project.completedTaskCount += 1;
        } else if (newStatus !== "done" && oldStatus === "done") {
          project.completedTaskCount = Math.max(0, project.completedTaskCount - 1);
        }
        saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      }
      logActivity(`moved task to ${newStatus.replace("_", " ")}`, task.title, "task");
    }

    return { ...task };
  },

  async delete(id: string): Promise<string> {
    await delay(550);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      tasks = tasks.filter((t) => t.id !== id);
      saveToStorage(STORAGE_KEYS.TASKS, tasks);

      const project = projects.find((p) => p.id === task.projectId);
      if (project) {
        project.taskCount = Math.max(0, project.taskCount - 1);
        if (task.status === "done") {
          project.completedTaskCount = Math.max(0, project.completedTaskCount - 1);
        }
        saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      }
      logActivity("deleted task", task.title, "task");
    }
    return id;
  },
};

// --- Members API ---
export const membersApi = {
  async getAll(): Promise<User[]> {
    await delay(500);
    return [...members];
  },

  async invite(input: { name: string; email: string; role: UserRole; department: string }): Promise<User> {
    await delay(700);
    const newMember: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: input.name,
      email: input.email,
      role: input.role,
      department: input.department,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    members = [...members, newMember];
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    logActivity("invited teammate", newMember.name, "member");
    return newMember;
  },

  async updateRole(id: string, role: UserRole): Promise<User> {
    await delay(450);
    const member = members.find((m) => m.id === id);
    if (!member) throw new Error("Member not found");
    member.role = role;
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    logActivity(`updated role to ${role} for`, member.name, "member");
    return { ...member };
  },

  async delete(id: string): Promise<string> {
    await delay(600);
    const member = members.find((m) => m.id === id);
    members = members.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    if (member) logActivity("removed member", member.name, "member");
    return id;
  },
};

// --- Dashboard API ---
export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    await delay(500);
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && new Date(t.dueDate) < new Date()
    ).length;
    const teamMembersCount = members.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      teamMembersCount,
      completionRate,
    };
  },

  async getActivities(): Promise<Activity[]> {
    await delay(450);
    return [...activities];
  },
};

// --- Settings API ---
export const settingsApi = {
  async getWorkspace(): Promise<WorkspaceSettings> {
    await delay(400);
    return { ...workspace };
  },

  async updateWorkspace(input: Partial<WorkspaceSettings>): Promise<WorkspaceSettings> {
    await delay(600);
    workspace = { ...workspace, ...input };
    saveToStorage(STORAGE_KEYS.WORKSPACE, workspace);
    logActivity("updated workspace settings", workspace.name, "project");
    return { ...workspace };
  },

  async updateNotifications(input: WorkspaceSettings["notifications"]): Promise<WorkspaceSettings> {
    await delay(500);
    workspace.notifications = input;
    saveToStorage(STORAGE_KEYS.WORKSPACE, workspace);
    return { ...workspace };
  },
};

// --- Auth API ---
export const authApi = {
  async getCurrentUser(): Promise<User> {
    await delay(350);
    return { ...currentUser };
  },

  async updateProfile(input: Partial<User>): Promise<User> {
    await delay(600);
    currentUser = { ...currentUser, ...input };
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    // Also update in members array
    const idx = members.findIndex((m) => m.id === currentUser.id);
    if (idx !== -1) {
      members[idx] = { ...members[idx], ...input };
      saveToStorage(STORAGE_KEYS.MEMBERS, members);
    }
    return { ...currentUser };
  },

  async login(email: string): Promise<User> {
    await delay(750);
    const user = members.find((m) => m.email.toLowerCase() === email.toLowerCase()) || currentUser;
    currentUser = { ...user };
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    return { ...currentUser };
  },

  async register(name: string, email: string): Promise<User> {
    await delay(800);
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      role: "admin",
      department: "Product",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    currentUser = newUser;
    members = [newUser, ...members];
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    return newUser;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(650);
    return {
      success: true,
      message: `If an account exists for ${email}, a password reset link has been dispatched.`,
    };
  },
};

