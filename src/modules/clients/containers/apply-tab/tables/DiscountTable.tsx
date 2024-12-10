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
      key: "adjustmentType"
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

export default DiscountTable;
