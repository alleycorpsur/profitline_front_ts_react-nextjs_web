import { useState } from "react";
import { Button, Flex, Input, Popconfirm, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { ArrowsClockwise, CaretLeft, Pencil } from "phosphor-react";

import { ModalSelectClients } from "../../modals/ModalSelectClients/ModalSelectClients";
import { ModalStatusClient } from "../../modals/ModalStatusClient/ModalStatusClient";
import { ModalRemove } from "../../modals/ModalRemove/ModalRemove";

import "./detailsgroupclienttable.scss";

const { Text } = Typography;
const { Search } = Input;

const initValuesDetails = { active: false, id: 0 };

interface Props {
  onCloseDetails: () => void;
}

export const DetailsGroupClientTable = ({ onCloseDetails }: Props) => {
  const [isDetailsClients, setIsDetailsClients] = useState(initValuesDetails);
  const [isModalStatus, setIsModalStatus] = useState({ status: false, remove: false });

  const columns: TableProps<any>["columns"] = [
    {
      title: "Nombre",
      dataIndex: "client_name",
      key: "client_name",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "NIT",
      dataIndex: "NIT",
      key: "NIT",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Cartera",
      key: "wallet",
      dataIndex: "wallet",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Usuarios",
      key: "users",
      dataIndex: "users",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Ship To",
      key: "ship_to",
      dataIndex: "ship_to",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Grupos",
      key: "groups",
      dataIndex: "groups",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Holding",
      key: "holding",
      dataIndex: "holding",
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
    }
  ];

  return (
    <>
      <main className="mainClientsProjectTable">
        <Flex justify="space-between" className="mainClientsProjectTable_header">
          <Flex gap={".75rem"} vertical align="flex-start">
            <Button
              className="buttonOutlinedStatus"
              size="large"
              type="text"
              icon={<CaretLeft />}
              onClick={onCloseDetails}
            >
              Cliente Pareto
            </Button>
            <Search size="large" placeholder="Cliente Pareto" style={{ width: "70%" }} />
          </Flex>
          <Flex gap={"1.45rem"} align="center">
            <Button
              size="large"
              htmlType="button"
              className="buttonOutlinedStatus"
              onClick={(e) => {
                e.preventDefault();
                setIsModalStatus({ status: true, remove: false });
              }}
              icon={<ArrowsClockwise size={"1.45rem"} />}
            >
              Cambiar Estado
            </Button>
            <Button
              className="buttonOutlined"
              size="large"
              onClick={() => setIsDetailsClients({ active: true, id: 0 })}
              // onClick={onCreateUser}
              icon={<Pencil size={"1.45rem"} />}
            >
              Editar Grupo
            </Button>
          </Flex>
        </Flex>
        <Table pagination={false} columns={columns} dataSource={data} />
      </main>
      <ModalSelectClients
        isOpen={isDetailsClients.active}
        nameGroupClient="Pareto"
        onClose={() => setIsDetailsClients(initValuesDetails)}
      />
      <ModalStatusClient
        isLegalCollection={false}
        typeToRemove="Grupo"
        isOpen={isModalStatus.status}
        setIsStatusClient={setIsModalStatus}
      />
      <ModalRemove
        name="cliente"
        isOpen={isModalStatus.remove}
        onClose={() => setIsModalStatus((s) => ({ ...s, remove: false }))}
        onRemove={() => {}}
      />
    </>
  );
};
const data = [
  {
    ID: 12,
    ACTIVE: true,
    NIT: "123123-2",
    wallet: 1233,
    client_name: "Clientes Pareto",
    users: 55,
    ship_to: 66,
    groups: 88,
    holding: 36
  },
  {
    ID: 2,
    ACTIVE: true,
    NIT: "123123-2",
    wallet: 1233,
    client_name: "Clientes Pareto",
    users: 55,
    ship_to: 66,
    groups: 88,
    holding: 36
  }
];
