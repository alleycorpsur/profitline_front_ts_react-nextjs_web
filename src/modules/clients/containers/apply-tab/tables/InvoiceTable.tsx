import React from "react";
import { Table } from "antd";
import { InvoiceData } from "./Types";

interface InvoiceTableProps {
  data: InvoiceData[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ data }) => {
  const columns = [
    { 
      title: "Factura", 
      dataIndex: "invoice", 
      key: "invoice",
      sorter: (a: InvoiceData, b: InvoiceData) => a.invoice! - b.invoice!
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
      title: "Pago", 
      dataIndex: "payment", 
      key: "payment",
      sorter: (a: InvoiceData, b: InvoiceData) => a.payment! - b.payment!
    },
    { 
      title: "Ajuste", 
      dataIndex: "adjustment", 
      key: "adjustment",
      sorter: (a: InvoiceData, b: InvoiceData) => a.adjustment! - b.adjustment!
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

export default InvoiceTable;