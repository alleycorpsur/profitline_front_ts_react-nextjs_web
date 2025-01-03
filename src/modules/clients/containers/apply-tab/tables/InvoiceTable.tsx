import React, { ReactNode, useState } from "react";
import { Button, Dropdown, Table, TableProps } from "antd";
import { DotsThreeVertical, Eye, Trash } from "phosphor-react";

import { formatDate, formatMoney } from "@/utils/utils";
import { ModalRemove } from "@/components/molecules/modals/ModalRemove/ModalRemove";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

interface InvoiceTableProps {
  data?: IApplyTabRecord[];
  // eslint-disable-next-line no-unused-vars
  handleDeleteRow?: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleEditRow: (row_id: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ data, handleDeleteRow, handleEditRow }) => {
  const [activeRow, setActiveRow] = useState<IApplyTabRecord | null>(null);
  const [removeModal, setRemoveModal] = useState(false);

  const columns: TableProps<IApplyTabRecord>["columns"] = [
    {
      title: "Factura",
      dataIndex: "id_erp",
      key: "id_erp",
      render: (id_erp) => <p className="sectionContainerTable__id">{id_erp}</p>,
      sorter: (a, b) => a.id_erp.localeCompare(b.id_erp),
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
      dataIndex: "initial_value",
      key: "initial_value",
      render: (initial_value) => <p>{formatMoney(initial_value)}</p>,
      sorter: (a, b) => a.initial_value - b.initial_value,
      showSorterTooltip: false
    },
    {
      title: "Pago",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{formatMoney(amount)}</p>,
      sorter: (a, b) => a.amount - b.amount,
      showSorterTooltip: false
    },
    {
      title: "Ajuste",
      dataIndex: "adjustment",
      key: "adjustment"
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
                  handleEditRow(row.id);
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
        dataSource={data}
        className="sectionContainerTable"
        pagination={false}
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

export default InvoiceTable;
