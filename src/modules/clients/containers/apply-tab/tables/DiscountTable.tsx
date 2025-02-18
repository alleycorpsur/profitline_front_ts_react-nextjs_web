import React, { ReactNode, useState } from "react";
import { Button, Dropdown, Table, TableProps } from "antd";
import { Eye, Trash, DotsThreeVertical } from "phosphor-react";

import { useAppStore } from "@/lib/store/store";

import { ModalRemove } from "@/components/molecules/modals/ModalRemove/ModalRemove";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

interface DiscountTableProps {
  data?: IApplyTabRecord[];
  // eslint-disable-next-line no-unused-vars
  handleDeleteRow?: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleEditRow: (row: IApplyTabRecord, editing_type: "invoice" | "payment" | "discount") => void;
  rowSelection: {
    selectedRowKeys: React.Key[];
    // eslint-disable-next-line no-unused-vars
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => void;
  };
}

const DiscountTable: React.FC<DiscountTableProps> = ({
  data,
  handleDeleteRow,
  handleEditRow,
  rowSelection
}) => {
  const formatMoney = useAppStore((state) => state.formatMoney);
  const [activeRow, setActiveRow] = useState<IApplyTabRecord | null>(null);
  const [removeModal, setRemoveModal] = useState(false);

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
      },
      showSorterTooltip: false
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
      render: (amount) => <p className="fontMonoSpace">{formatMoney(amount)}</p>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "Monto aplicado",
      dataIndex: "applied_amount",
      key: "applied_amount",
      render: (applied_amount) => <p className="fontMonoSpace">{formatMoney(applied_amount)}</p>,
      sorter: (a, b) => a.applied_amount - b.applied_amount,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "Saldo",
      dataIndex: "current_value",
      key: "current_value",
      render: (current_value) => <p className="fontMonoSpace">{formatMoney(current_value)}</p>,
      sorter: (a, b) => a.current_value - b.current_value,
      showSorterTooltip: false,
      align: "right"
    },
    {
      title: "Detalle",
      width: 76,
      render: (_, row) => {
        const items = [
          {
            key: "1",
            label: (
              <Button
                icon={<Eye size={20} />}
                className="buttonNoBorder"
                onClick={() =>
                  row.financial_discount_id && handleEditRow && handleEditRow(row, "discount")
                }
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
        dataSource={data?.map((data) => ({ ...data, key: data.financial_discount_id }))}
        className="sectionContainerTable customSticky"
        pagination={false}
        rowSelection={rowSelection}
        sticky={{
          offsetHeader: 160
        }}
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

export default DiscountTable;
