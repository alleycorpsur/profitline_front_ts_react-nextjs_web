import React, { ReactNode, useState } from "react";
import { Button, Dropdown, Table, TableProps } from "antd";
import { DotsThreeVertical, Eye, Trash } from "phosphor-react";

import { formatDate, formatMoney } from "@/utils/utils";
import { ModalRemove } from "@/components/molecules/modals/ModalRemove/ModalRemove";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

interface PaymentsTableProps {
  data?: IApplyTabRecord[];
  // eslint-disable-next-line no-unused-vars
  handleDeleteRow?: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleEditRow: (row_id: number) => void;
  rowSelection: {
    selectedRowKeys: React.Key[];
    // eslint-disable-next-line no-unused-vars
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => void;
  };
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  handleDeleteRow,
  handleEditRow,
  rowSelection
}) => {
  const [activeRow, setActiveRow] = useState<IApplyTabRecord | null>(null);

  const [removeModal, setRemoveModal] = useState(false);

  const columns: TableProps<IApplyTabRecord>["columns"] = [
    {
      title: "Pago",
      dataIndex: "payment_id",
      key: "payment_id",
      render: (id) => <p className="sectionContainerTable__id">{id}</p>,
      sorter: (a, b) => a.payment_id - b.payment_id,
      showSorterTooltip: false
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => <p>{date ? formatDate(date) : "-"}</p>,
      sorter: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
      showSorterTooltip: false
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
    },
    {
      title: "Detalle",
      width: 75,
      render: (_, row) => {
        const items = [
          {
            key: "1",
            label: (
              <Button
                icon={<Eye size={20} />}
                className="buttonNoBorder"
                onClick={() => {
                  setActiveRow(row);
                  handleEditRow(row.payment_id);
                }}
              >
                Ver
              </Button>
            )
          },
          {
            key: "2",
            label: (
              <Button
                icon={<Trash size={20} />}
                className="buttonNoBorder"
                onClick={() => {
                  setActiveRow(row);
                  setRemoveModal(true);
                }}
              >
                Eliminar
              </Button>
            )
          },
          {
            key: "3",
            label: (
              <Button icon={<Eye size={20} />} className="buttonNoBorder">
                Marcar como abono
              </Button>
            )
          }
        ];

        const customDropdown = (menu: ReactNode) => (
          <div className="dropdownApplicationTable">{menu}</div>
        );

        return (
          <Dropdown
            dropdownRender={customDropdown}
            menu={{ items }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button className="dotsBtn">
              <DotsThreeVertical size={16} />
            </Button>
          </Dropdown>
        );
      }
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.map((data) => ({ ...data, key: data.payment_id }))}
        className="sectionContainerTable"
        pagination={false}
        rowSelection={rowSelection}
      />

      <ModalRemove
        name="elemento"
        isOpen={removeModal}
        onClose={() => {
          setActiveRow(null);
          setRemoveModal(false);
        }}
        onRemove={() => {
          setActiveRow(null);
          setRemoveModal(false);
          handleDeleteRow && activeRow && handleDeleteRow(activeRow.id);
        }}
      />
    </>
  );
};

export default PaymentsTable;
