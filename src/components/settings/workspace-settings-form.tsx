"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { workspaceSchema, WorkspaceInput } from "@/lib/validations/settings";
import { useWorkspaceSettings, useUpdateWorkspace } from "@/hooks/use-settings";
import { toast } from "@/components/ui/toast";
import { Loader2, Sparkles } from "lucide-react";

export function WorkspaceSettingsForm() {
  const { data: workspace } = useWorkspaceSettings();
  const updateWorkspace = useUpdateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      billingEmail: "",
    },
  });

  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name,
        slug: workspace.slug,
        billingEmail: workspace.billingEmail,
      });
    }
  }, [workspace, reset]);

  const onSubmit = async (data: WorkspaceInput) => {
    await updateWorkspace.mutateAsync(data);
    toast.create({
      title: "Workspace Updated",
      description: "Organization details successfully updated.",
      type: "success",
    });
  };

  const isPending = updateWorkspace.isPending || isSubmitting;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Workspace & Organization</CardTitle>
        <CardDescription className="text-xs">
          Manage your organization name, slug, plan subscription, and billing email.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Plan Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">Current Plan: Pro Tier</h4>
                <Badge variant="secondary" className="font-semibold text-[10px] px-1.5 py-0 uppercase">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unlimited projects, Kanban boards, and team seat allocations.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.create({
                title: "Subscription Management",
                description: "Stripe billing portal simulation opened.",
                type: "info",
              })
            }
          >
            Manage Billing
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ws-name" className="text-xs font-semibold">
                Workspace Name
              </Label>
              <Input
                id="ws-name"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                className="h-9"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ws-slug" className="text-xs font-semibold">
                URL Identifier Slug
              </Label>
              <div className="flex items-center">
                <span className="h-9 px-3 flex items-center bg-muted text-muted-foreground border border-r-0 border-input rounded-l-md text-xs font-mono">
                  app.taskora.io/
                </span>
                <Input
                  id="ws-slug"
                  {...register("slug")}
                  aria-invalid={Boolean(errors.slug)}
                  className="h-9 rounded-l-none font-mono text-xs"
                />
              </div>
              {errors.slug && (
                <p className="text-[11px] text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ws-billing" className="text-xs font-semibold">
              Invoicing & Billing Email
            </Label>
            <Input
              id="ws-billing"
              type="email"
              {...register("billingEmail")}
              aria-invalid={Boolean(errors.billingEmail)}
              className="h-9"
            />
            {errors.billingEmail && (
              <p className="text-[11px] text-destructive">{errors.billingEmail.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending || !isDirty} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Save Workspace
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

