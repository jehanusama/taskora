import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required" })
    .max(120, { message: "Title cannot exceed 120 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters" })
    .default(""),
  projectId: z.string().min(1, { message: "Project selection is required" }),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assigneeId: z.string().optional(),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  labels: z.array(z.string()).default([]),
});

export type TaskInput = z.infer<typeof taskSchema>;

