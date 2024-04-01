import { Dispatch, SetStateAction } from "react";
import { Button, Flex, Table, TableProps, Typography } from "antd";
import { DotsThree, Eye, Plus } from "phosphor-react";
import { FilterClients } from "@/components/atoms/FilterClients/FilterClients";

import { useClients } from "@/hooks/useClients";
import { useAppStore } from "@/lib/store/store";

import "./clientsprojecttable.scss";

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
      key: "cliet_type",
      dataIndex: "cliet_type",
      render: (text) => <Text>{text}</Text>
    },
    // this is field is not available in back , but it's  on the design
    // {
    //   title: "Usuarios",
    //   key: "users",
    //   dataIndex: "users",
    //   render: (text) => <Text>{text}</Text>
    // },
    // {
    //   title: "Facturas",
    //   key: "bills",
    //   dataIndex: "bills",
    //   render: (text) => <Text>{text}</Text>
    // },
    // {
    //   title: "Cartera",
    //   key: "budget",
    //   dataIndex: "budget",
    //   render: (text) => <Text>{text}</Text>
    // },
    {
      title: "Riesgo",
      key: "risk",
      dataIndex: "risk",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Holding",
      key: "holding_name",
      dataIndex: "holding_name",
      render: (text) => <Text>{text ?? "No holding."}</Text>
    },
    {
      title: "Estado",
      key: "status",
      width: "150px",
      dataIndex: "status",
      render: (_, { status = "creado" }) => (
        <Flex
          align="center"
          className={status === "creado" ? "statusContainer" : "statusContainerPending"}
        >
          <div className={status === "creado" ? "statusActive" : "statusPending"} />
          <Text>{status === "creado" ? "Activo" : "Inactivo"}</Text>
        </Flex>
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

  return (
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
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{
          type: "checkbox"
        }}
      />
    </main>
  );
};
