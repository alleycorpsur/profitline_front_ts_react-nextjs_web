// import { Dispatch, SetStateAction } from "react";
import { Button, Checkbox, Flex, Popconfirm, Table, TableProps, Typography, Spin } from "antd";
import { DotsThree, Eye, Plus } from "phosphor-react";
// import { FilterClients } from "@/components/atoms/FilterClients/FilterClients";
import { ModalCreateClientsGroup } from "@/components/molecules/modals/ModalCreateClientsGroup/ModalCreateClientsGroup";
import { useState } from "react";
import { useClientsGroups } from "@/hooks/useClientsGroups";
import { IClientsGroups } from "@/types/clientsGroups/IClientsGroups";

import "./ClientsGroupsTable.scss";

const { Text, Link } = Typography;

interface Props {
  idProject: string;
  // setIsViewDetailsGroup: Dispatch<
  //   SetStateAction<{
  //     active: boolean;
  //     id: number;
  //   }>
  // >;
}

export const ClientsGroupsTable = ({
  idProject
  // setIsViewDetailsGroup
}: Props) => {
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const onCreateClientsGroup = () => {
    setIsCreateGroup(true);
  };

  // eslint-disable-next-line no-unused-vars
  const [selectedFilters, setSelectedFilters] = useState({
    clients: [] as any,
    subscribers: [] as any,
    status: "all" as "all" | "active" | "inactive",
    shipTo: [] as any
  });

  const { data, loading } = useClientsGroups({
    page: 1,
    idProject,
    clients: selectedFilters.clients,
    subscribers: selectedFilters.subscribers,
    activeUsers: selectedFilters.status
    // shipTo: selectedFilters.shipTo,
  });

  const columns: TableProps<IClientsGroups>["columns"] = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: () => <Checkbox />,
      width: "30px"
    },
    {
      title: "Nombre Grupo",
      dataIndex: "group_name",
      key: "group_name",
      render: (text) => <Link underline>{text}</Link>
    },
    {
      title: "Clientes",
      dataIndex: "CLIENTS",
      key: "CLIENTS",
      render: (text) => <Text>{text}clientes</Text>
    },
    {
      title: "Suscritos",
      key: "subcribers",
      dataIndex: "subcribers",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Ship To",
      key: "shipto_count",
      dataIndex: "shipto_count",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Estado",
      key: "active",
      dataIndex: "active",
      width: "150px",
      render: (_, { active }) => (
        <>
          {active ? (
            <Flex align="center" className={active ? "statusContainer" : "statusContainerPending"}>
              <div className={active ? "statusActive" : "statusPending"} />
              <Text>{active ? "Activo" : "Inactivo"}</Text>
            </Flex>
          ) : (
            <Popconfirm
              placement="topRight"
              title={"Invitación pendiente de aprobación"}
              description={"Volver a Enviar invitacion?"}
              okText="Si"
              cancelText="No"
            >
              <Flex
                align="center"
                className={active ? "statusContainer" : "statusContainerPending"}
              >
                <div className={active ? "statusActive" : "statusPending"} />
                <Text>{active ? "Activo" : "Inactivo"}</Text>
              </Flex>
            </Popconfirm>
          )}
        </>
      )
    },
    {
      title: "",
      key: "seeProject",
      width: "40px",
      dataIndex: "",
      render: (_, { id }) => (
        <Button
          onClick={() => console.log(`group with id:${id} clicked`)}
          icon={<Eye size={"1.3rem"} />}
        />
      )
    }
  ];

  return (
    <>
      <main className="mainClientsGroupsTable">
        <Flex justify="space-between" className="mainClientsGroupsTable_header">
          <Flex gap={"1.75rem"}>
            {/* <FilterClients /> */}
            <Button size="large" icon={<DotsThree size={"1.5rem"} />} />
          </Flex>
          <Button
            type="primary"
            className="buttonNewProject"
            size="large"
            onClick={onCreateClientsGroup}
            icon={<Plus weight="bold" size={15} />}
          >
            Crear Grupo de Clientes
          </Button>
        </Flex>

        {loading ? (
          <Flex style={{ height: "30%" }} align="center" justify="center">
            <Spin size="large" />
          </Flex>
        ) : (
          <Table columns={columns} dataSource={data.map((data) => ({ ...data, key: data.id }))} />
        )}
        <ModalCreateClientsGroup isOpen={isCreateGroup} setIsCreateGroup={setIsCreateGroup} />
      </main>
    </>
  );
};