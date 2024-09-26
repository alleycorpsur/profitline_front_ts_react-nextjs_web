import React from "react";
import { Table } from "antd";
import { InvoiceData } from "./Types";

interface DiscountTableProps {
  data: InvoiceData[];
}

const DiscountTable: React.FC<DiscountTableProps> = ({ data }) => {
  const columns = [
    { 
      title: "ID ajuste", 
      dataIndex: "adjustmentId", 
      key: "adjustmentId",
      sorter: (a: InvoiceData, b: InvoiceData) => a.adjustmentId! - b.adjustmentId!
    },
    { 
      title: "Tipo de ajuste", 
      dataIndex: "adjustmentType", 
      key: "adjustmentType",
      sorter: (a: InvoiceData, b: InvoiceData) => a.adjustmentType!.localeCompare(b.adjustmentType!)
    },
    { 
      title: "Facturas", 
      dataIndex: "invoices", 
      key: "invoices",
      sorter: (a: InvoiceData, b: InvoiceData) => a.invoices! - b.invoices!
    },
    { 
      title: "Monto", 
      dataIndex: "amount", 
      key: "amount",
      sorter: (a: InvoiceData, b: InvoiceData) => a.amount! - b.amount!
    },
    { 
      title: "Monto aplicado", 
      dataIndex: "appliedAmount", 
      key: "appliedAmount",
      sorter: (a: InvoiceData, b: InvoiceData) => a.appliedAmount - b.appliedAmount
    },
    { 
      title: "Saldo", 
      dataIndex: "balance", 
      key: "balance",
      sorter: (a: InvoiceData, b: InvoiceData) => a.balance - b.balance
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