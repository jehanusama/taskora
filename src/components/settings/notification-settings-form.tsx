"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWorkspaceSettings, useUpdateNotifications } from "@/hooks/use-settings";
import { notify } from "@/lib/notify";
import { WorkspaceSettings } from "@/types";
import { Loader2, BellRing, Mail, CheckCircle, FileText } from "lucide-react";

export function NotificationSettingsForm() {
  const { data: workspace } = useWorkspaceSettings();
  const updateNotifications = useUpdateNotifications();

  const [localSettings, setLocalSettings] = useState<WorkspaceSettings["notifications"] | null>(null);

  const settings = localSettings ?? workspace?.notifications ?? {
    emailDigest: true,
    taskAssignment: true,
    projectUpdates: true,
    weeklySummary: false,
  };

  const handleToggle = (key: keyof typeof settings) => {
    setLocalSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    await updateNotifications.mutateAsync(settings);
    setLocalSettings(null);
    notify.success(
      "Preferences Saved",
      "Notification alert preferences updated."
    );
  };

  const notificationOptions = [
    {
      key: "taskAssignment" as const,
      title: "Task Assignments & Mentions",
      description: "Receive instant notifications when you are assigned or mentioned on a task.",
      icon: BellRing,
    },
    {
      key: "projectUpdates" as const,
      title: "Project Milestone Changes",
      description: "Get notified when project statuses change or target delivery dates shift.",
      icon: CheckCircle,
    },
    {
      key: "emailDigest" as const,
      title: "Daily Activity Email Digest",
      description: "A summary email of all sprint board movements delivered every morning at 9am.",
      icon: Mail,
    },
    {
      key: "weeklySummary" as const,
      title: "Weekly Velocity Report",
      description: "Executive progress summary sent every Friday with team velocity metrics.",
      icon: FileText,
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Notifications & Alerts</CardTitle>
        <CardDescription className="text-xs">
          Select what types of communication and updates you wish to receive.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="divide-y divide-border/80">
          {notificationOptions.map((opt) => {
            const Icon = opt.icon;
            const checked = settings[opt.key];
            return (
              <div
                key={opt.key}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3 pr-4">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold cursor-pointer">
                      {opt.title}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <Switch
                  checked={checked}
                  onCheckedChange={() => handleToggle(opt.key)}
                  aria-label={opt.title}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateNotifications.isPending}
            className="gap-2"
          >
            {updateNotifications.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Save Notification Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

