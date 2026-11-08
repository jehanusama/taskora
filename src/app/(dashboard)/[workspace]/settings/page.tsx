import { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Settings | ${siteConfig.name}`,
  description: "Workspace configuration and user preferences.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
