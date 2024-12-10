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
      key: "id_erp"
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => <p className="cell -alignRight">{date ? formatDate(date) : "-"}</p>,
      sorter: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
      showSorterTooltip: false
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p className="cell -alignRight">{formatMoney(amount)}</p>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false
    },
    {
      title: "Pago",
      dataIndex: "payment",
      key: "payment"
    },
    {
      title: "Ajuste",
      dataIndex: "adjustment",
      key: "adjustment"
    },
    {
      title: "Saldo",
      dataIndex: "balance",
      key: "balance"
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
