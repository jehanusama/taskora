import {
  Kanban,
  FolderKanban,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Kanban,
    title: "Interactive Kanban Boards",
    description: "Drag-and-drop tasks seamlessly across stages with fluid micro-interactions and priority tags.",
  },
  {
    icon: FolderKanban,
    title: "Initiative & Project Tracking",
    description: "Monitor milestones, delivery timelines, and squad bandwidth in unified project cards.",
  },
  {
    icon: Users,
    title: "Role-Based Team Access",
    description: "Delegate tasks with granular Admin, Member, and Viewer permissions for airtight security.",
  },
  {
    icon: Zap,
    title: "Sub-Second State Sync",
    description: "TanStack Query caching ensures snappy UI updates and optimistic state mutations.",
  },
];

export function MarketingFeatures() {
  return (
    <section className="py-16 bg-muted/20 border-y border-border/60">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Everything required to ship on schedule
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Carefully crafted components, semantic design tokens, and smooth user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
