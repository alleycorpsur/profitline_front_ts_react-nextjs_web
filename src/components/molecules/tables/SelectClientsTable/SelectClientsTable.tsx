import { Dispatch, SetStateAction } from "react";
import useSWR from "swr";
import { Spin, Table, TableProps, Typography } from "antd";

import { fetcher } from "@/utils/api/api";
import { useAppStore } from "@/lib/store/store";
import { Key } from "antd/es/table/interface";

const { Text } = Typography;

interface Props {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

export const SelectClientsTable = ({ selectedRowKeys, setSelectedRowKeys }: Props) => {
  const { ID } = useAppStore((state) => state.selectProject);

  const pathKey = `/client/project/${ID}`;
  const { data, isLoading } = useSWR<any>(pathKey, fetcher, {});
  const onSelectChange = (newSelectedRowKeys: React.Key[]) =>
    setSelectedRowKeys(newSelectedRowKeys);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  return (
    <div style={{ maxHeight: "400px" }}>
      {isLoading ? (
        <Spin />
      ) : (
        <Table
          rowKey="nit"
          rowSelection={{
            type: "checkbox",
            ...rowSelection
          }}
          style={{ padding: "0 .3rem" }}
          pagination={false}
          columns={columns}
          dataSource={data.data}
        />
      )}
    </div>
  );
};
const columns: TableProps<any>["columns"] = [
  {
    title: "Nombre",
    key: "client_name",
    dataIndex: "client_name",
    render: (text) => <Text>{text}</Text>
  },
  {
    title: "NIT",
    key: "nit",
    dataIndex: "nit",
    render: (text) => <Text>{text}</Text>
  },
  // {
  //   title: "Ship To",
  //   key: "ship_to",
  //   dataIndex: "ship_to",
  //   render: (text) => <Text>{text}</Text>
  // },
  {
    title: "Holding",
    key: "holding_name",
    dataIndex: "holding_name",
    render: (text) => <Text>{text ?? "Sin Holding"}</Text>
  }
  // {
  //   title: "Cartera",
  //   key: "wallet",
  //   dataIndex: "wallet",
  //   render: (text) => <Text>{text}</Text>
  // },
  // {
  //   title: "Grupos",
  //   key: "groups",
  //   dataIndex: "groups",
  //   render: (text) => <Text>{text}</Text>
  // }
];
