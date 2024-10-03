import { Dispatch, SetStateAction, useState } from "react";
import { Button, Table, TableProps, Typography } from "antd";
import { useRouter } from "next/navigation";
import { Eye } from "phosphor-react";

import { useAppStore } from "@/lib/store/store";
import { formatDateDMY, formatMoney } from "@/utils/utils";

import { IOrder } from "@/types/commerce/ICommerce";
import "./orders-view-table.scss";

const { Text } = Typography;

interface PropsOrdersViewTable {
  dataSingleOrder: any[];
  setSelectedRows: Dispatch<SetStateAction<IOrder[] | undefined>>;
  orderStatus: string;
}

const OrdersViewTable = ({
  dataSingleOrder: data,
  setSelectedRows,
  orderStatus
}: PropsOrdersViewTable) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();
  const setDraftInfo = useAppStore((state) => state.setDraftInfo);

  const handleSeeDetail = (order: IOrder) => {
    const { id: orderId, order_status } = order;

    if (order_status === "En proceso") {
      const url = `/comercio/pedidoConfirmado/${orderId}`;
      router.prefetch(url);
      router.push(url);
    } else if (order_status === "Borrador") {
      const draftInfo = {
        id: orderId,
        client_name: order.client_name
      };
      setDraftInfo(draftInfo);
      router.push("/comercio/pedido");
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: IOrder[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length >= 1) {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows) {
          const filteredSelectedRows = newSelectedRows.filter(
            (newSelectedRow) =>
              !prevSelectedRows.some((prevSelectedRow) => prevSelectedRow.id === newSelectedRow.id)
          );
          const unCheckedRows = prevSelectedRows.filter(
            (prevSelectedRow) =>
              !newSelectedRowKeys.includes(prevSelectedRow.id) &&
              prevSelectedRow.order_status === orderStatus // Assuming you have an orderStatus variable
          );
          if (unCheckedRows.length > 0) {
            const filteredPrevSelectedRows = prevSelectedRows.filter(
              (prevSelectedRow) => !unCheckedRows.includes(prevSelectedRow)
            );
            return filteredPrevSelectedRows;
          }
          return [...prevSelectedRows, ...filteredSelectedRows];
        } else {
          return newSelectedRows;
        }
      });
    }
    if (newSelectedRowKeys.length === 0) {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows) {
          return prevSelectedRows.filter(
            (prevSelectedRow) => prevSelectedRow.order_status !== orderStatus
          );
        }
      });
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: TableProps<IOrder>["columns"] = [
    {
      title: "TR",
      dataIndex: "id",
      key: "id",
      render: (invoiceId) => <Text className="ordersViewTable__id">{invoiceId}</Text>,
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false
    },
    {
      title: "Cliente",
      dataIndex: "client_name",
      key: "client_name",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.client_name.localeCompare(b.client_name),
      showSorterTooltip: false
    },
    {
      title: "Fecha de creación",
      key: "order_date",
      dataIndex: "order_date",
      render: (date) => <Text className="cell">{date ? formatDateDMY(date) : ""}</Text>,
      sorter: (a, b) => new Date(a.order_date)?.getTime() - new Date(b.order_date)?.getTime(),
      showSorterTooltip: false
    },
    {
      title: "Ciudad",
      key: "city",
      dataIndex: "city",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.city.localeCompare(b.city),
      showSorterTooltip: false
    },
    {
      title: "Contacto",
      key: "contacto",
      dataIndex: "contacto",
      render: (text) => <Text className="cell">{text}</Text>
    },
    {
      title: "Total",
      key: "total",
      dataIndex: "total",
      render: (amount) => <Text className="cell">{formatMoney(amount)}</Text>,
      sorter: (a, b) => a.total - b.total,
      showSorterTooltip: false
    },
    {
      title: "Total pronto pago",
      key: "total_pronto_pago",
      dataIndex: "total_pronto_pago",
      render: (amount) => <Text className="cell">{formatMoney(amount)}</Text>,
      sorter: (a, b) => a.total_pronto_pago - b.total_pronto_pago,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "",
      key: "buttonSee",
      width: 64,
      dataIndex: "",
      render: (_, row) => (
        <Button
          onClick={() => handleSeeDetail(row)}
          className="buttonSeeProject"
          icon={<Eye size={"1.3rem"} />}
        />
      )
    }
  ];

  return (
    <>
      <Table
        className="ordersViewTable"
        columns={columns}
        dataSource={data.map((data) => ({ ...data, key: data.id }))}
        rowSelection={rowSelection}
        rowClassName={(record) => (selectedRowKeys.includes(record.id) ? "selectedRow" : "")}
        pagination={false}
      />
    </>
  );
};

export default OrdersViewTable;
