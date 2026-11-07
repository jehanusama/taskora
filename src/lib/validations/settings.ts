import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  title: z.string().min(1, { message: "Job title is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  bio: z.string().max(250, { message: "Bio cannot exceed 250 characters" }).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const workspaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required" }),
  slug: z
    .string()
    .min(2, { message: "Workspace URL slug is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  billingEmail: z.string().email({ message: "Invalid billing email" }),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;

export const notificationsSchema = z.object({
  emailDigest: z.boolean(),
  taskAssignment: z.boolean(),
  projectUpdates: z.boolean(),
  weeklySummary: z.boolean(),
});

export type NotificationsInput = z.infer<typeof notificationsSchema>;

