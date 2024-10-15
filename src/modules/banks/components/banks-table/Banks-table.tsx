import { Dispatch, SetStateAction, useState } from "react";
import { Button, Flex, Table, TableProps, Typography } from "antd";
import { Eye, Receipt } from "phosphor-react";

import { ISingleBank } from "@/types/banks/IBanks";
import { formatMoney } from "@/utils/utils";
import "./banks-table.scss";

const { Text } = Typography;

interface PropsBanksTable {
  clientsByStatus: any[];
  setSelectedRows: Dispatch<SetStateAction<ISingleBank[] | undefined>>;
  // eslint-disable-next-line no-unused-vars
  handleOpenPaymentDetail?: (payment: any) => void;
  bankStatusId: number;
}

export const BanksTable = ({
  clientsByStatus,
  setSelectedRows,
  handleOpenPaymentDetail,
  bankStatusId
}: PropsBanksTable) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: ISingleBank[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length >= 1) {
      // set the selected Rows but adding to the previous selected rows
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows) {
          //check if the new selected rows are already in the selected rows
          const filteredSelectedRows = newSelectedRows.filter(
            (newSelectedRow: ISingleBank) =>
              !prevSelectedRows.some((prevSelectedRow) => prevSelectedRow.id === newSelectedRow.id)
          );

          //filters the unselected rows but only the ones that have the status_id equal to bankStatusId
          const unCheckedRows = prevSelectedRows?.filter(
            (prevSelectedRow) =>
              !newSelectedRowKeys.includes(prevSelectedRow.id) &&
              prevSelectedRow.status_id === bankStatusId
          );
          if (unCheckedRows.length > 0) {
            // remove form the prevState the ones present in the unCheckedRows
            const filteredPrevSelectedRows = prevSelectedRows.filter(
              (prevSelectedRow) => !unCheckedRows.includes(prevSelectedRow)
            );
            return filteredPrevSelectedRows;
          }

          return [...prevSelectedRows, ...filteredSelectedRows];
        } else {
          return newSelectedRows;
        }
      });
    }
    //traverse the alreadySelectedRows and remove the ones that have the status_id of the bankStatusId
    if (newSelectedRowKeys.length === 0) {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows) {
          return prevSelectedRows.filter(
            (prevSelectedRow) => prevSelectedRow.status_id !== bankStatusId
          );
        }
      });
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: TableProps<ISingleBank>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text className="idText">{text}</Text>
    },
    {
      title: "Cliente",
      dataIndex: "client_name",
      key: "client_name",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Monto",
      key: "amount",
      dataIndex: "amount",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      title: "Descripción",
      key: "description",
      dataIndex: "description",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Cuenta",
      key: "account_number",
      dataIndex: "account_number",
      render: (text) => (
        <>
          <Text>{text}</Text>
          <p className="accountBankText">Bancolombia</p>
        </>
      )
    },
    {
      title: "",
      key: "seeProject",
      width: "40px",
      dataIndex: "",
      render: (_, recoder) => (
        <Flex gap={"0.5rem"}>
          <Button className="buttonSeeEvidence" icon={<Receipt size={"1.3rem"} />} />
          <Button
            className="buttonSeeClient"
            icon={
              <Eye
                size={"1.3rem"}
                onClick={() => handleOpenPaymentDetail && handleOpenPaymentDetail(recoder.id)}
              />
            }
          />
        </Flex>
      )
    }
  ];

  return (
    <Table
      className="banksTable"
      loading={false}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={clientsByStatus.map((data) => ({
        ...data,
        key: data.id
      }))}
      pagination={false}
    />
  );
};

export default BanksTable;
