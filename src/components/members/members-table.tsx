"use client";

import React, { useState } from "react";
import { Trash2, Shield, UserCheck, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { User, UserRole } from "@/types";
import { useUpdateMemberRole, useRemoveMember } from "@/hooks/use-members";
import { toast } from "@/components/ui/toast";

interface MembersTableProps {
  members: User[];
  currentUserId?: string;
}

export function MembersTable({ members, currentUserId }: MembersTableProps) {
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const handleRoleChange = (member: User, newRole: UserRole) => {
    updateRole.mutate(
      { id: member.id, role: newRole },
      {
        onSuccess: () => {
          toast.create({
            title: "Role Updated",
            description: `${member.name} is now a ${newRole}.`,
            type: "success",
          });
        },
      }
    );
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;
    removeMember.mutate(memberToRemove.id, {
      onSuccess: () => {
        toast.create({
          title: "Member Removed",
          description: `${memberToRemove.name} has been removed from workspace.`,
          type: "success",
        });
        setMemberToRemove(null);
      },
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="size-3 text-primary" />;
      case "member":
        return <UserCheck className="size-3 text-success" />;
      case "viewer":
        return <Eye className="size-3 text-muted-foreground" />;
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Team Member</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Department</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => {
                const isSelf = member.id === currentUserId;
                return (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* User info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar size="default" className="border border-border">
                          {member.avatarUrl && (
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                          )}
                          <AvatarFallback className="text-xs font-semibold">
                            {member.name
                              ? member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate flex items-center gap-1.5">
                            {member.name}
                            {isSelf && (
                              <Badge variant="secondary" className="text-[10px] h-4 px-1 font-normal">
                                You
                              </Badge>
                            )}
                          </p>
                          <p className="text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-muted-foreground font-medium">
                      {member.department || "General"}
                    </td>

                    {/* Role Selector */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getRoleIcon(member.role)}
                        <select
                          value={member.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            handleRoleChange(member, e.target.value as UserRole)
                          }
                          className="h-8 rounded-md border border-input bg-transparent px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className="bg-success/15 text-success border-success/30 font-medium capitalize text-[11px]"
                      >
                        {member.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={isSelf}
                        onClick={() => setMemberToRemove(member)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
                        aria-label={`Remove ${member.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title={`Remove ${memberToRemove?.name}?`}
        description="This will revoke all access for this member to your workspace. Their assigned tasks will become unassigned."
        confirmLabel="Remove Member"
        onConfirm={handleConfirmRemove}
        isLoading={removeMember.isPending}
      />
    </>
  );
}

