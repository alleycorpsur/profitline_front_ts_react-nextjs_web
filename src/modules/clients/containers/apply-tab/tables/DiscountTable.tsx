import React, { ReactNode } from "react";
import { Button, Dropdown, Table, TableProps } from "antd";
import { Eye, Trash, DotsThreeVertical } from "phosphor-react";

import { formatMoney } from "@/utils/utils";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

interface DiscountTableProps {
  data?: IApplyTabRecord[];
}

const DiscountTable: React.FC<DiscountTableProps> = ({ data }) => {
  const handleOpenDetail = (id: number) => {
    console.info("Open detail", id);
  };

  const handleDeleteRow = (id: number) => {
    console.info("Delete row", id);
  };

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
                onClick={() =>
                  row.financial_discount_id && handleOpenDetail(row.financial_discount_id)
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
                onClick={() =>
                  row.financial_discount_id && handleDeleteRow(row.financial_discount_id)
                }
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
    <Table
      columns={columns}
      dataSource={data}
      className="sectionContainerTable"
      pagination={false}
    />
  );
};

export default DiscountTable;
