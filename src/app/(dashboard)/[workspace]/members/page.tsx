import { Metadata } from "next";
import { MembersView } from "@/components/members/members-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Team Members | ${siteConfig.name}`,
  description: "Collaborators and role management.",
};

export default function MembersPage() {
  return <MembersView />;
}
