import { z } from "zod";

export const inviteMemberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  role: z.enum(["admin", "member", "viewer"]),
  department: z.string().min(1, { message: "Department is required" }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

