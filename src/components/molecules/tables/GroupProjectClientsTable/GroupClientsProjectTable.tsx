import { useState } from "react";
import { Button, Checkbox, Flex, Popconfirm, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { DotsThree, Eye, Plus } from "phosphor-react";

import { ModalNewGroupClient } from "../../modals/ModalNewGroupClient/ModalNewGroupClient";

import "./groupclientsprojecttable.scss";
import { FilterClients } from "@/components/atoms/FilterClients/FilterClients";
import { DetailsGroupClientTable } from "../GroupClientDetailsTable/DetailsGroupClientTable";

const { Text } = Typography;

const initValuesDetails = { active: false, id: 0 };

export const GroupProjectClientsTable = () => {
  const [isCreateGroupClient, setIsCreateGroupClient] = useState(false);
  const [isDetailsClients, setIsDetailsClients] = useState(initValuesDetails);

  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: () => <Checkbox />,
      width: "30px"
    },
    {
      title: "Nombre grupo",
      dataIndex: "client_name",
      key: "client_name",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Clientes",
      dataIndex: "clients",
      key: "clients",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Suscritos",
      key: "clients_subscribed",
      dataIndex: "clients_subscribed",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Ship To",
      key: "shipto",
      dataIndex: "shipto",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Estado",
      key: "status",
      width: "150px",
      dataIndex: "status",
      render: (_, { ACTIVE }) => (
        <>
          {ACTIVE ? (
            <Flex align="center" className={ACTIVE ? "statusContainer" : "statusContainerPending"}>
              <div className={ACTIVE ? "statusActive" : "statusPending"} />
              <Text>{ACTIVE ? "Activo" : "Inactivo"}</Text>
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
                className={ACTIVE ? "statusContainer" : "statusContainerPending"}
              >
                <div className={ACTIVE ? "statusActive" : "statusPending"} />
                <Text>{ACTIVE ? "Activo" : "Inactivo"}</Text>
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
      render: (_, { ID }) => (
        <Button
          onClick={() => setIsDetailsClients({ active: true, id: ID })}
          icon={<Eye size={"1.3rem"} />}
        />
      )
    }
  ];

  return (
    <>
      {!isDetailsClients.active ? (
        <main className="mainUsersProjectTable">
          <Flex justify="space-between" className="mainUsersProjectTable_header">
            <Flex gap={"1.75rem"}>
              <FilterClients />
              <Button size="large" icon={<DotsThree size={"1.5rem"} />} />
            </Flex>
            <Button
              type="primary"
              className="buttonNewProject"
              size="large"
              onClick={() => setIsCreateGroupClient(true)}
              // onClick={onCreateUser}
              icon={<Plus weight="bold" size={15} />}
            >
              Crear grupo de clientes
            </Button>
          </Flex>

          <Table columns={columns} dataSource={data} />
        </main>
      ) : (
        <DetailsGroupClientTable onCloseDetails={() => setIsDetailsClients(initValuesDetails)} />
      )}
      <ModalNewGroupClient
        isOpen={isCreateGroupClient}
        onClose={() => setIsCreateGroupClient(false)}
      />
    </>
  );
};
const data = [
  {
    ID: 1,
    ACTIVE: false,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 2,
    ACTIVE: true,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 3,
    ACTIVE: false,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 4,
    ACTIVE: true,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 5,
    ACTIVE: false,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 8,
    ACTIVE: true,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 9,
    ACTIVE: true,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 10,
    ACTIVE: false,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  },
  {
    ID: 11,
    ACTIVE: true,
    client_name: "Clientes Pareto",
    clients: 55,
    clients_subscribed: 66,
    shipto: 88
  }
];
