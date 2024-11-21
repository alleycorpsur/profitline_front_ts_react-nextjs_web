import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Table, TableProps, Typography } from "antd";
import { Eye } from "phosphor-react";

import { formatDate, formatMoney } from "@/utils/utils";
import { useSelectedPayments } from "@/context/SelectedPaymentsContext";

import { IClientPayment } from "@/types/clientPayments/IClientPayments";

import "./payments-table.scss";

const { Text } = Typography;

interface PropsInvoicesTable {
  paymentsByStatus: IClientPayment[];
  setSelectedRows: Dispatch<SetStateAction<IClientPayment[]>>;
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

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: IClientPayment[]) => {
    setSelectedRowKeys(newSelectedRowKeys);

    setSelectedPayments((prevSelectedPayments) => {
      if (newSelectedRowKeys.length >= 1) {
        // Filter out newly selected rows that aren't already in prevSelectedPayments
        const filteredNewRows = newSelectedRows.filter(
          (newRow) => !prevSelectedPayments.some((prevRow) => prevRow.id === newRow.id)
        );

        // Filter out unselected rows for this payment status
        const remainingRows = prevSelectedPayments.filter(
          (row) => row.id_status !== paymentStatusId || newSelectedRowKeys.includes(row.id)
        );

        return [...remainingRows, ...filteredNewRows];
      } else {
        // If no rows are selected for this status, remove all rows of this status
        return prevSelectedPayments.filter((row) => row.id_status !== paymentStatusId);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: TableProps<IClientPayment>["columns"] = [
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
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <Text className="cell">{formatDate(text)}</Text>,
      sorter: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
      showSorterTooltip: false
    },
    {
      title: "Identificación",
      key: "identified",
      dataIndex: "identified",
      // render: (text) => <Text className="cell">{formatDate(text)}</Text>,
      // sorter: (a, b) => Date.parse(a.identified) - Date.parse(b.identified),
      showSorterTooltip: false
    },
    {
      title: "Referencia",
      key: "reference",
      dataIndex: "reference",
      render: (text) => <Text className="cell">{text}</Text>,
      // sorter: (a, b) => a.reference - b.reference,
      showSorterTooltip: false
    },
    {
      title: "Monto",
      key: "initial_value",
      dataIndex: "initial_value",
      render: (initial_value) => <Text className="cell">{formatMoney(initial_value)}</Text>,
      sorter: (a, b) => a.initial_value - b.initial_value,
      showSorterTooltip: false
    },
    {
      title: "Disponible",
      key: "current_value",
      dataIndex: "current_value",
      render: (current_value) => <Text className="cell">{formatMoney(current_value)}</Text>,
      sorter: (a, b) => a.current_value - b.current_value,
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
