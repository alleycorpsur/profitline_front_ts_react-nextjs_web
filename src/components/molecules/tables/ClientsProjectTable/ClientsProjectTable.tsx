import { Dispatch, SetStateAction } from "react";
import { Button, Checkbox, Flex, Popconfirm, Table, TableProps, Typography } from "antd";
import { DotsThree, Eye, Plus } from "phosphor-react";
import { FilterClients } from "@/components/atoms/FilterClients/FilterClients";

import "./clientsprojecttable.scss";
import { useClients } from "@/hooks/useClients";
import { useAppStore } from "@/lib/store/store";

const { Text, Link } = Typography;

interface Props {
  setIsCreateClient: Dispatch<SetStateAction<boolean>>;
  setIsViewDetailsClients: Dispatch<
    SetStateAction<{
      active: boolean;
      id: number;
    }>
  >;
}

export const ClientsProjectTable = ({ setIsCreateClient, setIsViewDetailsClients }: Props) => {
  const onCreateClient = () => {
    setIsCreateClient(true);
  };
  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: () => <Checkbox />,
      width: "30px"
    },
    {
      title: "Name",
      dataIndex: "client_name",
      key: "client_name",
      render: (text) => <Link underline>{text}</Link>
    },
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Tipo de Cliente",
      key: "TypeClient",
      dataIndex: "TypeClient",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Usuarios",
      key: "users",
      dataIndex: "users",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Facturas",
      key: "bills",
      dataIndex: "bills",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Cartera",
      key: "budget",
      dataIndex: "budget",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Riesgo",
      key: "risk",
      dataIndex: "risk",
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
      render: (_, { ACTIVE = true }) => (
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
      render: (_, { key }) => (
        <Button
          onClick={() => setIsViewDetailsClients({ active: true, id: key })}
          icon={<Eye size={"1.3rem"} />}
        />
      )
    }
  ];
  const { ID } = useAppStore((state) => state.selectProject);
  const { data } = useClients({
    idProject: ID
  });
  console.log(data);

  return (
    <>
      <main className="mainClientsProjectTable">
        <Flex justify="space-between" className="mainClientsProjectTable_header">
          <Flex gap={"1.75rem"}>
            <FilterClients />
            <Button size="large" icon={<DotsThree size={"1.5rem"} />} />
          </Flex>
          <Button
            type="primary"
            className="buttonNewProject"
            size="large"
            onClick={onCreateClient}
            icon={<Plus weight="bold" size={15} />}
          >
            Nuevo Cliente
          </Button>
        </Flex>

        <Table columns={columns} dataSource={data} />
      </main>
    </>
  );
};
