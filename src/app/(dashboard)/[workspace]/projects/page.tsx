import { Metadata } from "next";
import { ProjectsView } from "@/components/projects/projects-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description: "View and manage active projects and deliverables.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
