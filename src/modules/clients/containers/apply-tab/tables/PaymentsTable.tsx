import React from "react";
import { Table, TableProps } from "antd";
import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";
import { formatDate, formatMoney } from "@/utils/utils";

interface PaymentsTableProps {
  data?: IApplyTabRecord[];
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ data }) => {
  const columns: TableProps<IApplyTabRecord>["columns"] = [
    {
      title: "Pago",
      dataIndex: "payment_id",
      key: "payment_id",
      render: (id) => <p className="sectionContainerTable__id">{id}</p>,
      sorter: (a, b) => a.payment_id - b.payment_id
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
      title: "Monto aplicado",
      dataIndex: "appliedAmount",
      key: "appliedAmount"
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

export default PaymentsTable;
