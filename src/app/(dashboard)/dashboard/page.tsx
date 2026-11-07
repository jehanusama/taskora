import { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Overview | ${siteConfig.name}`,
  description: "Workspace delivery overview and priority tasks.",
};

export default function DashboardPage() {
  return <DashboardView />;
}

