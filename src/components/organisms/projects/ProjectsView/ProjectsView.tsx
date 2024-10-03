"use client";
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { ProjectTable } from "@/components/molecules/tables/ProjectsTable/ProjectsTable";

import "./projects.scss";
import Header from "../../header";

export const ProjectsView = () => {
  return (
    <main className="mainProject">
      <SideBar />
      <div className="contentProject">
        <Header title="Proyectos" />
        <ProjectTable />
      </div>
    </main>
  );
};
