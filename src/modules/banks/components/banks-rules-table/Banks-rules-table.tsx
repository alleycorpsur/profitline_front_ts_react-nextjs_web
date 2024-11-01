import { Dispatch, Key, SetStateAction } from "react";
import { Button, Flex, Table, TableProps } from "antd";
import { PencilLine, Triangle } from "phosphor-react";

import { IAllRules, IRules } from "@/types/banks/IBanks";

import "./banks-rules-table.scss";

interface PropsBanksRulesTable {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
  rules: IAllRules | undefined;
  page: number;
  // eslint-disable-next-line no-unused-vars
  onChangePage: (page: number) => void;
  setShowBankRuleModal: Dispatch<
    SetStateAction<{
      isOpen: boolean;
      ruleId: number;
    }>
  >;
}

export const BanksRulesTable = ({
  selectedRowKeys,
  setSelectedRowKeys,
  rules,
  page,
  onChangePage,
  setShowBankRuleModal
}: PropsBanksRulesTable) => {
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const handleOpenEditRule = (ruleId: number) => {
    setShowBankRuleModal({
      isOpen: true,
      ruleId
    });
  };

  const columns: TableProps<IRules>["columns"] = [
    {
      title: "Descripción",
      dataIndex: "description",
      className: "tableColumn",
      render: (text) => <p className="tableInfo">{text}</p>
    },
    {
      align: "center",
      className: "tableColumn -equalSign",
      render: () => <p>=</p>
    },
    {
      title: "Nombre de cliente",
      dataIndex: "client_name",
      className: "tableColumn",
      render: (client_name) => <p className="tableInfo">{client_name || "-"}</p>
    },
    {
      title: "Coincidencia",
      dataIndex: "is_exactly",
      className: "tableColumn",
      render: (is_exactly) => (
        <p className="tableInfo">{is_exactly ? "Coincidencia exacta" : "Contiene"}</p>
      )
    },
    {
      width: "1rem",
      className: "tableColumn",
      render: (_, row) => (
        <Button onClick={() => handleOpenEditRule(row.id)} className="editButton">
          <PencilLine size={24} />
        </Button>
      )
    }
  ];

  return (
    <Table
      className="banksRulesTable"
      columns={columns}
      rowClassName={"banksRules__tableRow"}
      dataSource={rules?.data.map((data) => ({ ...data, key: data.id }))}
      rowSelection={rowSelection}
      pagination={{
        current: page,
        showSizeChanger: false,
        position: ["none", "bottomRight"],
        total: rules?.total,
        onChange: onChangePage,
        itemRender: (page, type, originalElement) => {
          if (type === "prev") {
            return <Triangle size={".75rem"} weight="fill" className="prev" />;
          } else if (type === "next") {
            return <Triangle size={".75rem"} weight="fill" className="next" />;
          } else if (type === "page") {
            return <Flex justify="center">{page}</Flex>;
          }
          return originalElement;
        }
      }}
    />
  );
};

export default BanksRulesTable;
