"use client";

import React, { useState, useMemo } from "react";
import { UserPlus, Users, Search, RefreshCw, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { MembersTable } from "./members-table";
import { InviteMemberDialog } from "./invite-member-dialog";
import { useMembers } from "@/hooks/use-members";
import { useCurrentUser } from "@/hooks/use-auth";

export function MembersView() {
  const [search, setSearch] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const {
    data: members = [],
    isLoading,
    isError,
    refetch,
  } = useMembers();

  const { data: currentUser } = useCurrentUser();

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        m.role.toLowerCase().includes(q)
    );
  }, [members, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Team Members"
        description="Manage workspace collaborators, assign security roles, and invite new members."
        badge={members.length}
      >
        <Button onClick={() => setInviteDialogOpen(true)} className="gap-2 shadow-xs">
          <UserPlus className="size-4" />
          <span>Invite Teammate</span>
        </Button>
      </PageHeader>

      {/* Search Bar */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search teammates by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-9 pr-8 text-sm bg-card"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear member search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <Card className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </Card>
      ) : isError ? (
        <EmptyState
          icon={RefreshCw}
          title="Could not load members"
          description="Failed to fetch workspace members. Please try again."
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No members match your search" : "No members found"}
          description={
            search
              ? "Try searching with a different name or email address."
              : "Invite your teammates to start collaborating on boards and tasks."
          }
          actionLabel={search ? "Clear Search" : "Invite Teammate"}
          onAction={search ? () => setSearch("") : () => setInviteDialogOpen(true)}
        />
      ) : (
        <MembersTable members={filteredMembers} currentUserId={currentUser?.id} />
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}

