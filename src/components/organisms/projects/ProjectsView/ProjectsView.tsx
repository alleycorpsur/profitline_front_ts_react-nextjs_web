"use client";
import { Flex, Typography } from "antd";

import { SideBar } from "@/components/molecules/SideBar/SideBar";
// import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";
import { ProjectTable } from "@/components/molecules/tables/ProjectsTable/ProjectsTable";

import "./projects.scss";

const { Title } = Typography;

export const ProjectsView = () => {
  return (
    <main className="mainProject">
      <SideBar />
      <Flex vertical className="contentProject">
        <Flex justify="space-between" align="center">
          <Flex gap={"1rem"} align="center">
            <Title level={2} className="titleName">
              Proyectos
            </Title>
          </Flex>
          {/* <NavRightSection /> */}
        </Flex>
        <ProjectTable />
      </Flex>
    </main>
  );
};
