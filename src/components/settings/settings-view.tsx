"use client";

import React, { useState } from "react";
import { User, Building2, Bell, Palette } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileSettingsForm } from "./profile-settings-form";
import { WorkspaceSettingsForm } from "./workspace-settings-form";
import { NotificationSettingsForm } from "./notification-settings-form";
import { AppearanceSettingsForm } from "./appearance-settings-form";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "workspace" | "notifications" | "appearance";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: "My Profile", icon: User },
    { id: "workspace" as const, label: "Workspace", icon: Building2 },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage workspace settings, user profile, notification preferences, and themes."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings Navigation Menu */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav
            className="flex flex-row lg:flex-col gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5 shadow-xs"
            aria-label="Settings navigation"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileSettingsForm />}
          {activeTab === "workspace" && <WorkspaceSettingsForm />}
          {activeTab === "notifications" && <NotificationSettingsForm />}
          {activeTab === "appearance" && <AppearanceSettingsForm />}
        </div>
      </div>
    </div>
  );
}

