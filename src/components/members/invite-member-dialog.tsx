"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMemberSchema, InviteMemberInput } from "@/lib/validations/member";
import { useInviteMember } from "@/hooks/use-members";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const inviteMember = useInviteMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      role: "member",
      department: "Engineering",
    },
  });

  const onSubmit = async (data: InviteMemberInput) => {
    await inviteMember.mutateAsync(data);
    toast.create({
      title: "Invitation Sent",
      description: `An invite has been dispatched to ${data.email}.`,
      type: "success",
    });
    reset();
    onOpenChange(false);
  };

  const isPending = inviteMember.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">
            Invite Teammate
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Invite a new colleague to collaborate on projects, tasks, and sprint boards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="member-name" className="text-xs font-semibold">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-name"
              placeholder="e.g. Rachel Zane"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
              className="h-9"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="member-email" className="text-xs font-semibold">
              Work Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-email"
              type="email"
              placeholder="rachel@company.com"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              className="h-9"
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="member-role" className="text-xs font-semibold">
                Access Role
              </Label>
              <select
                id="member-role"
                {...register("role")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-dept" className="text-xs font-semibold">
                Department
              </Label>
              <select
                id="member-dept"
                {...register("department")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Engineering">Engineering</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="QA & Testing">QA & Testing</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

