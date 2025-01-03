import { useState } from "react";
import { Button, Flex, Table, TableProps, Typography } from "antd";
import { Eye, Triangle } from "phosphor-react";

import { formatDate } from "@/utils/utils";

import useScreenHeight from "@/components/hooks/useScreenHeight";
import { ModalConfirmAction } from "@/components/molecules/modals/ModalConfirmAction/ModalConfirmAction";

import { IHistoryRow } from "@/types/clientHistory/IClientHistory";

import "./history-tab-table.scss";

const { Text } = Typography;

interface PropsHistoryTable {
  dataAllRecords?: IHistoryRow[];
}

const HistoryTable = ({ dataAllRecords: data }: PropsHistoryTable) => {
  const [page, setPage] = useState(1);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] = useState({
    isOpen: false,
    id: 0
  });

  const height = useScreenHeight();

  const onChangePage = (pagePagination: number) => {
    setPage(pagePagination);
  };

  const handleCancelApplication = () => {
    console.info("Anular aplicación con id", isConfirmCancelModalOpen.id);
    setIsConfirmCancelModalOpen({ isOpen: false, id: 0 });
  };

  const columns: TableProps<IHistoryRow>["columns"] = [
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => <Text className="cell">{formatDate(created_at)}</Text>,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      showSorterTooltip: false,
      width: 120
    },
    {
      title: "Evento",
      dataIndex: "event",
      key: "event",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.event.localeCompare(b.event),
      showSorterTooltip: false
    },
    {
      title: "Descripción",
      key: "description",
      dataIndex: "description",
      render: (description) => <span className="cell">{description}</span>,
      sorter: (a, b) => a.description.localeCompare(b.description),
      showSorterTooltip: false
    },
    {
      title: "Usuario",
      key: "user_name",
      dataIndex: "user_name",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
      showSorterTooltip: false
    },
    {
      title: "",
      render: (_, record) => (
        <Flex gap="0.5rem">
          <Button
            className="eyeButton"
            onClick={() => setIsConfirmCancelModalOpen({ isOpen: true, id: record.id })}
            icon={<Eye size={"1.2rem"} />}
          />
        </Flex>
      ),
      width: 65
    }
  ];

  return (
    <>
      <Table
        className="historyTable"
        columns={columns}
        dataSource={data?.map((data) => ({ ...data, key: data.id }))}
        virtual
        scroll={{ y: height - 400, x: 100 }}
        pagination={{
          current: page,
          showSizeChanger: false,
          position: ["none", "bottomRight"],
          onChange: onChangePage,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return <Triangle size={".75rem"} weight="fill" className="prev" />;
            } else if (type === "next") {
              return <Triangle size={".75rem"} weight="fill" className="next" />;
            } else if (type === "page") {
              return <Flex className="pagination">{page}</Flex>;
            }
            return originalElement;
          }
        }}
      />
      <ModalConfirmAction
        isOpen={isConfirmCancelModalOpen.isOpen}
        onClose={() =>
          setIsConfirmCancelModalOpen({
            isOpen: false,
            id: 0
          })
        }
        title="¿Estás seguro que deseas anular esta apliación?"
        content="Esta acción es definitiva"
        onOk={handleCancelApplication}
        okText="Anular aplicación"
      />
    </>
  );
};

export default HistoryTable;
