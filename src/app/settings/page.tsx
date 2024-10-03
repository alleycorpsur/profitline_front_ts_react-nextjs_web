import { ProjectsView } from "@/components/organisms/projects/ProjectsView/ProjectsView";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profitline"
};

export default function Home() {
  return <ProjectsView />;
}
