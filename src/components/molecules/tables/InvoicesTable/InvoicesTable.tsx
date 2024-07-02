import { Dispatch, SetStateAction, useState } from "react";
import { Button, Table, TableProps, Tooltip, Typography } from "antd";

import { IInvoice } from "@/types/invoices/IInvoices";
import { CheckCircle, Eye, Handshake, Warning, WarningCircle } from "phosphor-react";
import "./invoicestable.scss";
import { daysLeft, formatDate, insertPeriodEveryThreeDigits } from "@/utils/utils";

const { Text } = Typography;

interface PropsInvoicesTable {
  dataSingleInvoice: IInvoice[];
  setSelectedRows: Dispatch<SetStateAction<IInvoice[] | undefined>>;
  setShowInvoiceDetailModal: Dispatch<
    SetStateAction<{
      isOpen: boolean;
      invoiceId: number;
    }>
  >;
}

export const InvoicesTable = ({
  dataSingleInvoice: data,
  setSelectedRows,
  setShowInvoiceDetailModal
}: PropsInvoicesTable) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const openInvoiceDetail = (invoiceId: number) => {
    setShowInvoiceDetailModal({ isOpen: true, invoiceId });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRow: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRow);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: TableProps<IInvoice>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (invoiceId) => (
        <Text onClick={() => openInvoiceDetail(invoiceId)} className="invoicesTable__id">
          {invoiceId}
        </Text>
      ),
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false
    },
    {
      title: "Emisión",
      dataIndex: "create_at",
      key: "create_at",
      render: (text) => <Text className="cell -alignRight">{formatDate(text)}</Text>,
      sorter: (a, b) => Date.parse(a.create_at) - Date.parse(b.create_at),
      showSorterTooltip: false,
      align: "right",
      width: 120
    },
    {
      title: "Pronto pago",
      key: "earlypay_date",
      dataIndex: "earlypay_date",
      render: (text) => <Text className="cell -alignRight">{formatDate(text)}</Text>,
      sorter: (a, b) => Date.parse(a.earlypay_date) - Date.parse(b.earlypay_date),
      showSorterTooltip: false,
      align: "right",
      width: 150
    },
    {
      title: "Vence",
      key: "expiration_date",
      dataIndex: "expiration_date",
      render: (text, record) => (
        <Tooltip
          title={
            <div className="toolTip -expirationDate">
              <p>Fecha de vencimiento</p>
              <strong>{formatDate(text)}</strong>
              <p>
                Condición de pago <strong>X días</strong>
              </p>
            </div>
          }
          color={"#f7f7f7"}
          key={record.id}
        >
          <Text className="expirationText cell -alignRight">
            {daysLeft(text)} días <WarningCircle size={16} />
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => Date.parse(a.expiration_date) - Date.parse(b.expiration_date),
      showSorterTooltip: false,
      align: "right",
      width: 140
    },
    {
      title: "Monto inicial",
      key: "initial_value",
      dataIndex: "initial_value",
      render: (amount) => (
        <Text className="cell -alignRight">${insertPeriodEveryThreeDigits(amount)}</Text>
      ),
      sorter: (a, b) => a.initial_value - b.initial_value,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "Ajustes",
      key: "ajust_value",
      dataIndex: "ajust_value",
      render: (amount) =>
        amount === 0 ? null : amount > 0 ? (
          <Text className="cell -alignRight">${insertPeriodEveryThreeDigits(amount)}</Text>
        ) : (
          <Text className="negativeAdjustment cell -alignRight">
            ${insertPeriodEveryThreeDigits(amount)}
          </Text>
        ),
      sorter: (a, b) => a.ajust_value - b.ajust_value,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "Pendiente",
      key: "current_value",
      dataIndex: "current_value",
      render: (amount) => (
        <Text className="cell -alignRight">${insertPeriodEveryThreeDigits(amount)}</Text>
      ),
      sorter: (a, b) => a.current_value - b.current_value,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "",
      className: "logosWrapper",
      render: (_, record) => (
        <div className="logos">
          <Tooltip
            title={
              <div className="toolTip -paymentAgreement">
                <p>Acuerdo de pago</p>
                <p>
                  Fecha <strong>xx/xx/xxxx</strong>
                </p>
                <p>
                  Monto <strong>$XXXXX</strong>
                </p>
              </div>
            }
            color={"#f7f7f7"}
            key={`A${record.id}`}
          >
            <Button icon={<Handshake size={"1.2rem"} />} />
          </Tooltip>

          <Tooltip
            title={
              <div className="toolTip -priceDifference">
                <p>Diferencia en precios</p>
                <p>
                  Monto <strong>$XXXXXX</strong>
                </p>
                <p>Producto faltante</p>
                <p>
                  Descuento <strong>$XXXXXX</strong>
                </p>
              </div>
            }
            color={"#f7f7f7"}
            key={`B${record.id}`}
          >
            <Button icon={<Warning size={"1.2rem"} />} />
          </Tooltip>

          <Tooltip
            title={
              <div className="toolTip -clientAccept">
                <p>Aceptación cliente</p>
                <p>Email</p>
                <strong>DD-MM-YYYY</strong>
              </div>
            }
            color={"#f7f7f7"}
            key={`C${record.id}`}
          >
            <Button icon={<CheckCircle size={"1.2rem"} />} />
          </Tooltip>

          <Button onClick={() => openInvoiceDetail(record.id)} icon={<Eye size={"1.2rem"} />} />
        </div>
      ),
      width: 100,
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
        className="invoicesTable"
        columns={columns}
        dataSource={data.map((data) => ({ ...data, key: data.id }))}
        rowSelection={rowSelection}
        rowClassName={(record) => (selectedRowKeys.includes(record.id) ? "selectedRow" : "")}
      />
    </>
  );
};
