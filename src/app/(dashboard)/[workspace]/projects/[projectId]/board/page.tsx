import { Suspense } from "react";
import { Metadata } from "next";
import { KanbanView } from "@/components/kanban/kanban-view";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { siteConfig } from "@/config/site";

interface BoardPageProps {
  params: Promise<{
    workspace: string;
    projectId: string;
  }>;
}

export const metadata: Metadata = {
  title: `Kanban Board | ${siteConfig.name}`,
  description: "Visual sprint board and workflow pipeline.",
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { projectId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading Kanban board..." />
        </div>
      }
    >
      <KanbanView projectId={projectId} />
    </Suspense>
  );
}
