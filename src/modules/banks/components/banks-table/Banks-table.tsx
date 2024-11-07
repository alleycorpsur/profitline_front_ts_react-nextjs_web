import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Flex, Table, TableProps, Typography } from "antd";
import { Eye, Receipt } from "phosphor-react";

import { formatDateDMY, formatMoney } from "@/utils/utils";
import { ISingleBank } from "@/types/banks/IBanks";

import "./banks-table.scss";

const { Text } = Typography;

interface clientByStatus extends ISingleBank {
  client_status_id: number;
}
interface PropsBanksTable {
  clientsByStatus: clientByStatus[];
  setSelectedRows: Dispatch<SetStateAction<ISingleBank[] | undefined>>;
  // eslint-disable-next-line no-unused-vars
  handleOpenPaymentDetail?: (payment: ISingleBank) => void;
  bankStatusId: number;
  clearSelected: boolean;
}

export const BanksTable = ({
  clientsByStatus,
  setSelectedRows,
  handleOpenPaymentDetail,
  bankStatusId,
  clearSelected
}: PropsBanksTable) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [clearSelected]);

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
              prevSelectedRow.id_status === bankStatusId
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
            (prevSelectedRow) => prevSelectedRow.id_status !== bankStatusId
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
      render: (text, record) => (
        <Text
          className="idText"
          onClick={() => handleOpenPaymentDetail && handleOpenPaymentDetail(record)}
        >
          {text}
        </Text>
      ),
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      width: 100
    },
    {
      title: "Cliente",
      dataIndex: "CLIENT_NAME",
      key: "CLIENT_NAME",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.CLIENT_NAME.localeCompare(b.CLIENT_NAME),
      showSorterTooltip: false
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <Text>{formatDateDMY(text)}</Text>,
      sorter: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
      showSorterTooltip: false,
      width: 110
    },
    {
      title: "Monto",
      key: "current_value",
      dataIndex: "current_value",
      render: (text) => <Text>{formatMoney(text)}</Text>,
      sorter: (a, b) => (a.current_value ?? 0) - (b.current_value ?? 0),
      showSorterTooltip: false,
      width: 130
    },
    {
      title: "Descripción",
      key: "description",
      dataIndex: "description",
      render: (text) => <p className="description">{text}</p>,
      sorter: (a, b) => a.description.localeCompare(b.description),
      showSorterTooltip: false
    },
    {
      title: "Cuenta",
      key: "bank_description",
      dataIndex: "bank_description",
      render: (text) => (
        <>
          <Text>123456</Text>
          <p className="accountBankText">{text}</p>
        </>
      )
    },
    {
      title: "",
      key: "seeProject",
      width: "40px",
      dataIndex: "",
      render: (_, record) => (
        <Flex gap={"0.5rem"}>
          <Button className="buttonSeeEvidence" icon={<Receipt size={"1.3rem"} />} />
          <Button
            className="buttonSeeClient"
            icon={
              <Eye
                size={"1.3rem"}
                onClick={() => handleOpenPaymentDetail && handleOpenPaymentDetail(record)}
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
      pagination={{
        pageSize: 15,
        showSizeChanger: false
      }}
    />
  );
};

export default BanksTable;
