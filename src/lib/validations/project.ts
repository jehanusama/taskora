import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Project name is required" })
    .max(80, { message: "Project name cannot exceed 80 characters" }),
  key: z
    .string()
    .min(2, { message: "Key must be at least 2 characters" })
    .max(6, { message: "Key cannot exceed 6 characters" })
    .regex(/^[A-Z0-9]+$/, { message: "Key must be uppercase alphanumeric (e.g. PRJ)" }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .default(""),
  color: z.string().min(1, { message: "Please select a theme color" }),
  status: z.enum(["active", "completed", "on_hold", "archived"]).default("active"),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  memberIds: z.array(z.string()).min(1, { message: "Assign at least one member" }),
});

export type ProjectInput = z.infer<typeof projectSchema>;

