import { Checkbox, Table, TableProps, Typography } from "antd";

const { Text } = Typography;
export const SelectClientsTable = () => {
  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: () => <Checkbox />,
      width: "30px"
    },
    {
      title: "Nombre",
      key: "client_name",
      dataIndex: "client_name",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "NIT",
      key: "ship_to",
      dataIndex: "ship_to",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Ship To",
      key: "ship_to",
      dataIndex: "ship_to",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Holding",
      key: "holding",
      dataIndex: "holding",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Cartera",
      key: "wallet",
      dataIndex: "wallet",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Grupos",
      key: "groups",
      dataIndex: "groups",
      render: (text) => <Text>{text}</Text>
    }
  ];
  return (
    <div>
      <Table
        style={{ padding: "0 .3rem" }}
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};
const data = [
  {
    key: "1",
    client_name: "Coopidrogas",
    NIT: "347623472",
    ship_to: 36,
    holding: "Keralty",
    wallet: "123.254.320",
    groups: 3
  },
  {
    key: "2",
    client_name: "Coopidrogas",
    NIT: "347623472",
    ship_to: 36,
    holding: "Keralty",
    wallet: "123.254.320",
    groups: 3
  },
  {
    key: "3",
    client_name: "Coopidrogas",
    NIT: "347623472",
    ship_to: 36,
    holding: "Keralty",
    wallet: "123.254.320",
    groups: 3
  },
  {
    key: "4",
    client_name: "Coopidrogas",
    NIT: "347623472",
    ship_to: 36,
    holding: "Keralty",
    wallet: "123.254.320",
    groups: 3
  }
];
