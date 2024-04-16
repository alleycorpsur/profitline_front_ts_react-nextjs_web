import { useState } from "react";
import { Button, Flex, Result, Skeleton, Spin, Tabs, TabsProps, Typography, message } from "antd";

//components
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { ProjectFormTab } from "@/components/molecules/tabs/Projects/ProjectForm/ProjectFormTab";
// import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";
import { UsersProjectTable } from "@/components/molecules/tables/UsersProjectTable/UsersProjectTable";
import { UserProjectForm } from "@/components/molecules/tabs/Projects/UserProjectForm/UserProjectForm";
import { ClientsProjectView } from "../ClientsProjectView/ClientsProjectView";

// tools
import { useProject } from "@/hooks/useProject";
import { activateProject, desactiveProject, updateProject } from "@/services/projects/projects";
import { SUCCESS } from "@/utils/constants/globalConstants";
import { IUpdateFormProject } from "@/types/projects/IUpdateFormProject";

import "./detailproject.scss";
import { BusinessRulesView } from "../BusinessRulesView/BusinessRulesView";

const { Title, Text } = Typography;
interface Props {
  isEdit?: boolean;
  idProjectParam: string;
}

export const DetailsProjectView = ({ isEdit = false, idProjectParam = "" }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { loading, data } = useProject({ id: idProjectParam });

  const [isEditProject, setIsEditProject] = useState(isEdit);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [isViewDetailsUser, setIsViewDetailsUser] = useState({
    active: false,
    id: 0
  });

  const onGoBackTableUsers = () => {
    setIsCreateUser(false);
    setIsViewDetailsUser({
      active: false,
      id: 0
    });
  };

  const onUpdateProject = async (finalData: IUpdateFormProject) => {
    try {
      const response = await updateProject(finalData, idProjectParam, data.UUID);
      if (response.status === SUCCESS) {
        messageApi.open({
          type: "success",
          content: "El proyecto fue editado exitosamente."
        });
      }
      setIsEditProject(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Oops, hubo un error por favor intenta mas tarde."
      });
    }
  };
  const onActiveProject = async () => {
    try {
      await activateProject(idProjectParam);
      messageApi.open({
        type: "success",
        content: "El proyecto fue activado exitosamente."
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Oops, hubo un error por favor intenta mas tarde."
      });
    }
  };
  const onDesactivateProject = async () => {
    try {
      await desactiveProject(idProjectParam);
      messageApi.open({
        type: "success",
        content: "El proyecto fue desactivado exitosamente."
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Oops, hubo un error por favor intenta mas tarde."
      });
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Proyecto",
      children: (
        <>
          {loading ? (
            <Flex style={{ height: "30%" }} align="center" justify="center">
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
        </>
      )
    },
    {
      key: "2",
      label: "Reglas de Negocio",
      children: <BusinessRulesView />
    },
    {
      key: "3",
      label: "Clientes",
      children: <ClientsProjectView />
    },
    {
      key: "4",
      label: "Usuarios",
      children:
        isCreateUser || isViewDetailsUser.active ? (
          <UserProjectForm
            onGoBackTable={onGoBackTableUsers}
            isViewDetailsUser={isViewDetailsUser}
            setIsCreateUser={setIsCreateUser}
            setIsViewDetailsUser={setIsViewDetailsUser}
          />
        ) : (
          <UsersProjectTable
            idProject={idProjectParam}
            setIsViewDetails={setIsViewDetailsUser}
            setIsCreateUser={setIsCreateUser}
          />
        )
    },
    {
      key: "5",
      label: "Cuentas",
      children: "Content of Tab Pane 3"
    }
  ];

  return (
    <>
      {contextHolder}
      <main className="mainDetailProject">
        <SideBar />
        <Flex vertical className="containerDetailProject">
          <Flex
            style={{ display: data.length === 0 && !loading ? "none" : "flex" }}
            component={"navbar"}
            align="center"
            justify="space-between"
          >
            <Flex className="infoHeaderProject">
              <Flex gap={"2rem"} align="center" style={{ width: "100%" }}>
                {loading ? (
                  <>
                    <Skeleton.Input size="large" />
                    <Skeleton.Input size="large" />
                  </>
                ) : (
                  <>
                    <Title level={1} className="titleName">
                      {data.PROJECT_DESCRIPTION ?? ""}
                    </Title>
                  </>
                )}
              </Flex>
            </Flex>
            {/* <Flex align="center">
              <NavRightSection />
            </Flex> */}
          </Flex>
          {/* ------------Main Info Project-------------- */}
          {!loading && data.length === 0 ? (
            <Flex vertical>
              <Flex align="center" gap={"2rem"}>
                <Button href="/">Volver</Button>
                <Text>Informacion No encontrada</Text>
              </Flex>
              <Result
                status="404"
                title="404"
                subTitle="Lo siento este proyecto no existe"
                extra={
                  <Button type="primary" href="/">
                    Back Home
                  </Button>
                }
              />
            </Flex>
          ) : (
            <Flex className="tabsContainer">
              <Tabs
                style={{ width: "100%", height: "100%" }}
                defaultActiveKey="1"
                items={items}
                size="large"
              />
            </Flex>
          )}
        </Flex>
      </main>
    </>
  );
};
