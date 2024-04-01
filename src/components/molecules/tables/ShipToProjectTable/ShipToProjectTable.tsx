import { Dispatch, SetStateAction } from "react";
import { Button, Checkbox, Flex, Table, TableProps, Typography } from "antd";
import { Eye, Plus } from "phosphor-react";

import { useShipTo } from "@/hooks/useShipTo";
import { useAppStore } from "@/lib/store/store";

import "./shiptoprojecttable.scss";

const { Text, Title } = Typography;

interface Props {
  setIsCreateShipTo: Dispatch<SetStateAction<boolean>>;
}

export const ShipToProjectTable = ({ setIsCreateShipTo }: Props) => {
  const { ID } = useAppStore((state) => state.selectProject);
  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: () => <Checkbox />,
      width: "30px"
    },
    {
      title: "ID Ship To",
      dataIndex: "accounting_code",
      key: "accounting_code",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Ciudad",
      dataIndex: "city",
      key: "city",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Canal",
      key: "channel",
      dataIndex: "channel",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Linea",
      key: "line",
      dataIndex: "line",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Sublinea",
      key: "subline",
      dataIndex: "subline",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Zona",
      key: "zone",
      dataIndex: "zone",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Hereda parámetros",
      key: "heritage",
      dataIndex: "heritage",
      width: "200px",
      render: (text) => <Text>{text ?? "Si"}</Text>
    },
    {
      title: "",
      key: "seeProject",
      width: "40px",
      dataIndex: "",
      render: () => (
        <Button onClick={() => setIsCreateShipTo(true)} icon={<Eye size={"1.3rem"} />} />
      )
    }
  ];
  const { data } = useShipTo({ idProject: `${ID}` });

  return (
    <main className="mainShipToProjectTable">
      <Flex justify="space-between" className="mainClientsProjectTable_header">
        <Title level={4}>Ship To</Title>
        <Flex gap={"1rem"}>
          <Button
            type="primary"
            className="buttonOutlined"
            size="large"
            icon={<Plus weight="bold" size={15} />}
          >
            Descargar plantilla
          </Button>
          <Button
            type="primary"
            className="buttonOutlined"
            size="large"
            icon={<Plus weight="bold" size={15} />}
          >
            Cargar excel
          </Button>
        </Flex>
      </Flex>
      <Table style={{ padding: "0 1rem" }} pagination={false} columns={columns} dataSource={data} />
      <Button
        size="large"
        type="text"
        className="buttonCreateShipTo"
        onClick={() => setIsCreateShipTo(true)}
        icon={<Plus weight="bold" size={15} />}
      >
        Crear Ship To
      </Button>
    </main>
  );
};
