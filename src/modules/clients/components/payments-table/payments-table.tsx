import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Table, TableProps, Typography } from "antd";
import { Eye } from "phosphor-react";
import { formatDate, formatMoney } from "@/utils/utils";
import { IPayment } from "@/types/payments/IPayments";

import "./payments-table.scss";
import { useSelectedPayments } from "@/context/SelectedPaymentsContext";

const { Text } = Typography;

interface PropsInvoicesTable {
  paymentsByStatus: IPayment[];
  setSelectedRows: Dispatch<SetStateAction<IPayment[]>>;
  setShowPaymentDetail: Dispatch<
    SetStateAction<{
      isOpen: boolean;
      paymentId: number;
    }>
  >;
  paymentStatusId: number;
}

const PaymentsTable = ({
  paymentsByStatus: data,
  setSelectedRows,
  setShowPaymentDetail,
  paymentStatusId
}: PropsInvoicesTable) => {
  const { selectedPayments, setSelectedPayments } = useSelectedPayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const openPaymentDetail = (paymentId: number) => {
    setShowPaymentDetail({ isOpen: true, paymentId });
  };

  useEffect(() => {
    // Update selectedRowKeys based on global selectedPayments
    setSelectedRowKeys(selectedPayments.map((payment) => payment.id));
  }, [selectedPayments]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: IPayment[]) => {
    setSelectedRowKeys(newSelectedRowKeys);

    setSelectedPayments((prevSelectedPayments) => {
      if (newSelectedRowKeys.length >= 1) {
        // Filter out newly selected rows that aren't already in prevSelectedPayments
        const filteredNewRows = newSelectedRows.filter(
          (newRow) => !prevSelectedPayments.some((prevRow) => prevRow.id === newRow.id)
        );

        // Filter out unselected rows for this payment status
        const remainingRows = prevSelectedPayments.filter(
          (row) => row.payment_status_id !== paymentStatusId || newSelectedRowKeys.includes(row.id)
        );

        return [...remainingRows, ...filteredNewRows];
      } else {
        // If no rows are selected for this status, remove all rows of this status
        return prevSelectedPayments.filter((row) => row.payment_status_id !== paymentStatusId);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: TableProps<IPayment>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (paymentId) => (
        <p onClick={() => openPaymentDetail(paymentId)} className="paymentsTable__id">
          {paymentId}
        </p>
      ),
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      width: 130
    },
    {
      title: "Ingreso",
      dataIndex: "entered",
      key: "entered",
      render: (text) => <Text className="cell">{formatDate(text)}</Text>,
      sorter: (a, b) => Date.parse(a.entered) - Date.parse(b.entered),
      showSorterTooltip: false
    },
    {
      title: "Identificación",
      key: "identified",
      dataIndex: "identified",
      render: (text) => <Text className="cell">{formatDate(text)}</Text>,
      sorter: (a, b) => Date.parse(a.identified) - Date.parse(b.identified),
      showSorterTooltip: false
    },
    {
      title: "Referencia",
      key: "reference",
      dataIndex: "reference",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.reference - b.reference,
      showSorterTooltip: false
    },
    {
      title: "Monto",
      key: "amount",
      dataIndex: "amount",
      render: (amount) => <Text className="cell">{formatMoney(amount)}</Text>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false
    },
    {
      title: "Disponible",
      key: "available",
      dataIndex: "available",
      render: (available) => <Text className="cell">{formatMoney(available)}</Text>,
      sorter: (a, b) => a.available - b.available,
      showSorterTooltip: false
    },
    {
      title: "",
      render: (_, record) => (
        <Button onClick={() => openPaymentDetail(record.id)} icon={<Eye size={"1.2rem"} />} />
      ),
      width: 60,
      onCell: () => ({
        style: {
          flex: 2
        }
      })
    }
  ];

  return (
    <>
      <Table
        className="paymentsTable"
        columns={columns}
        dataSource={data?.map((data) => ({ ...data, key: data.id }))}
        rowSelection={rowSelection}
        rowClassName={(record) => (selectedRowKeys.includes(record.id) ? "selectedRow" : "")}
        pagination={false}
      />
    </>
  );
};

export default PaymentsTable;
