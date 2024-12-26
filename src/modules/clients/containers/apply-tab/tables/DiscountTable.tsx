import React from "react";
import { Table, TableProps } from "antd";
import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";
import { formatMoney } from "@/utils/utils";

interface DiscountTableProps {
  data?: IApplyTabRecord[];
}

const DiscountTable: React.FC<DiscountTableProps> = ({ data }) => {
  const columns: TableProps<IApplyTabRecord>["columns"] = [
    {
      title: "ID ajuste",
      dataIndex: "financial_discount_id",
      key: "financial_discount_id",
      render: (id) => <p className="sectionContainerTable__id">{id}</p>,
      sorter: (a, b) => {
        if (a.financial_discount_id && b.financial_discount_id) {
          return a.financial_discount_id - b.financial_discount_id;
        }
        return 0;
      }
    },
    {
      title: "Tipo de ajuste",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
      render: () => <p>Nota credito</p>
    },
    {
      title: "Facturas",
      dataIndex: "invoices",
      key: "invoices"
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{formatMoney(amount)}</p>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false
    },
    {
      title: "Monto aplicado",
      dataIndex: "applied_amount",
      key: "applied_amount",
      render: (applied_amount) => <p>{formatMoney(applied_amount)}</p>,
      sorter: (a, b) => a.applied_amount - b.applied_amount,
      showSorterTooltip: false
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

export default DiscountTable;
