import React from "react";
import { DiscountBasics } from "@/types/discount/DiscountBasics";
import { Button, Checkbox, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { Eye } from "phosphor-react";

type Props = {
  // eslint-disable-next-line no-unused-vars
  handleSelect: (id: number, status: boolean) => void;
  handleDeactivate: (id: number, status: boolean) => void;
};

// eslint-disable-next-line no-unused-vars
const discountsColumns: (_: Props) => ColumnsType<DiscountBasics & { checked: boolean }> = ({
  handleSelect,
  handleDeactivate
}) => [
  {
    title: "",
    dataIndex: "id",
    render: (id, record) => (
      <>
        {
          <Checkbox
            id={id}
            checked={record.checked}
            onChange={(e) => handleSelect(id, e.target.checked)}
          />
        }
      </>
    ),
    key: "SelectDiscount",
    width: 50
  },
  {
    title: "Nombre",
    dataIndex: "discount_name",
    key: "NameDiscount",
    render: (text, r) => (
      <Link passHref href={`/descuentos/${r.id}`}>
        {text}
      </Link>
    ),
    sorter: (a, b) => (a.discount_name < b.discount_name ? -1 : 1)
  },
  {
    title: "Cliente",
    dataIndex: "client_name",
    key: "ClientDiscount",
    sorter: (a, b) => (a.client_name?.localeCompare(b.client_name || "") ? 1 : -1)
  },
  {
    title: "Tipo descuentos",
    dataIndex: "discount_type",
    key: "TypeDiscount",
    sorter: (a, b) => (a.discount_type < b.discount_type ? 1 : -1)
  },
  {
    title: "Definiciones",
    dataIndex: "discount_definition",
    key: "DefinitionDiscount",
    sorter: (a, b) => (a.discount_definition < b.discount_definition ? 1 : -1)
  },
  {
    title: "Fecha inicio",
    dataIndex: "start_date",
    key: "StartDateDiscount",
    sorter: (a, b) => (new Date(a.start_date) < new Date(b.start_date) ? 1 : -1),
    render: (text) => new Date(text).toLocaleDateString()
  },
  {
    title: "Fecha fin",
    dataIndex: "end_date",
    key: "EndDateDiscount",
    sorter: (a, b) =>
      a.end_date && b.end_date && new Date(a.end_date) < new Date(b.end_date) ? 1 : -1,
    render: (text) => (text ? new Date(text).toLocaleDateString() : "")
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "StatusDiscount",
    sorter: (a, b) => a.status - b.status,
    render: (text, record) => (
      <Switch checked={text} onChange={(checked) => handleDeactivate(record.id, checked)} />
    )
  },
  {
    title: "",
    dataIndex: "",
    key: "ActionsDiscount",
    width: 100,
    render: (text, r) => (
      <div>
        <Link href={`/descuentos/${r.id}`}>
          <Button type="text" icon={<Eye size={32} style={{ padding: "0.2rem" }} />} />
        </Link>
      </div>
    )
  }
];

export { discountsColumns };
