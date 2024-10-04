import React from "react";
import { Table } from "antd";
import { InvoiceData } from "./Types";

interface PaymentsTableProps {
  data: InvoiceData[];
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ data }) => {
  const columns = [
    { 
      title: "Pagos", 
      dataIndex: "payments", 
      key: "payments",
      sorter: (a: InvoiceData, b: InvoiceData) => a.payments! - b.payments!
    },
    { 
      title: "Fecha", 
      dataIndex: "date", 
      key: "date",
      sorter: (a: InvoiceData, b: InvoiceData) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
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

export default PaymentsTable;