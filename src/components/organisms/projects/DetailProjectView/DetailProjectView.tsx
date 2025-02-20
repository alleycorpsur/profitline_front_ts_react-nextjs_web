"use client";

import { useState } from "react";
import { Button, Flex, Result, Spin, Typography } from "antd";
import { useParams } from "next/navigation";

// Hooks & Services
import { useProject } from "@/hooks/useProject";
import { activateProject, desactiveProject, updateProject } from "@/services/projects/projects";
import { SUCCESS } from "@/utils/constants/globalConstants";
import { extractSingleParam } from "@/utils/utils";

import { ProjectFormTab } from "@/components/molecules/tabs/Projects/ProjectForm/ProjectFormTab";

import { IFormProject } from "@/types/projects/IFormProject";
import { useMessageApi } from "@/context/MessageContext";

// Styles
import "./detailproject.scss";

const { Text } = Typography;

export const DetailsProjectView = () => {
  const params = useParams();
  const projectId = extractSingleParam(params.id) || "";
  const { showMessage } = useMessageApi();
  const { loading, data } = useProject({ id: projectId });

  const [isEditProject, setIsEditProject] = useState(false);

  const onUpdateProject = async (finalData: IFormProject) => {
    try {
      const response = await updateProject(finalData, projectId, data?.UUID || "");
      if (response.status === SUCCESS) {
        showMessage("success", "El proyecto fue editado exitosamente.");
        window.location.reload();
      }
      setIsEditProject(false);
    } catch (error) {
      console.warn("Error updating project: ", error);
      showMessage("error", "Oops, hubo un error. Por favor, intenta más tarde.");
    }
  };

  const onActiveProject = async () => {
    try {
      await activateProject(projectId);
      showMessage("success", "El proyecto fue activado exitosamente.");
    } catch (error) {
      console.warn("Error activating project: ", error);
      showMessage("error", "Oops, hubo un error. Por favor, intenta más tarde.");
    }
  };

  const onDesactivateProject = async () => {
    try {
      await desactiveProject(projectId);
      showMessage("success", "El proyecto fue desactivado exitosamente.");
    } catch (error) {
      console.warn("Error deactivating project: ", error);
      showMessage("error", "Oops, hubo un error. Por favor, intenta más tarde.");
    }
  };

  return (
    <Flex vertical className="containerDetailProject">
      {/* Main Content */}
      {!loading && !data ? (
        <Flex vertical>
          <Flex align="center" gap={"2rem"}>
            <Button href="/settings">Volver</Button>
            <Text>Información no encontrada</Text>
          </Flex>
          <Result
            status="404"
            title="404"
            subTitle="Lo siento, este proyecto no existe."
            extra={
              <Button type="primary" href="/settings">
                Volver a inicio
              </Button>
            }
          />
        </Flex>
      ) : (
        <Flex>
          {loading ? (
            <Flex style={{ height: "500px", width: "100%" }} align="center" justify="center">
              <Spin size="large" />
            </Flex>
          ) : (
            <ProjectFormTab
              onSubmitForm={onUpdateProject}
              onEditProject={() => setIsEditProject(true)}
              data={data}
              statusForm={isEditProject ? "edit" : "review"}
              onActiveProject={onActiveProject}
              onDesactivateProject={onDesactivateProject}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
