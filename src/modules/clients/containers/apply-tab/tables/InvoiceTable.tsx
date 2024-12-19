import React from "react";
import { Table, TableProps } from "antd";
import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";
import { formatDate, formatMoney } from "@/utils/utils";

interface InvoiceTableProps {
  data?: IApplyTabRecord[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ data }) => {
  const columns: TableProps<IApplyTabRecord>["columns"] = [
    {
      title: "Factura",
      dataIndex: "id_erp",
      key: "id_erp",
      render: (id_erp) => <p className="sectionContainerTable__id">{id_erp}</p>,
      sorter: (a, b) => a.id_erp.localeCompare(b.id_erp),
      showSorterTooltip: false
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => <p>{date ? formatDate(date) : "-"}</p>,
      sorter: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
      showSorterTooltip: false
    },
    {
      title: "Monto",
      dataIndex: "initial_value",
      key: "initial_value",
      render: (initial_value) => <p>{formatMoney(initial_value)}</p>,
      sorter: (a, b) => a.initial_value - b.initial_value,
      showSorterTooltip: false
    },
    {
      title: "Pago",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{formatMoney(amount)}</p>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false
    },
    {
      title: "Ajuste",
      dataIndex: "adjustment",
      key: "adjustment"
    },
    {
      title: "Saldo",
      dataIndex: "current_value",
      key: "current_value",
      render: (current_value) => <p>{formatMoney(current_value)}</p>,
      sorter: (a, b) => a.current_value - b.current_value,
      showSorterTooltip: false
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      className="sectionContainerTable"
      pagination={false}
    />
  );
};

export default InvoiceTable;
