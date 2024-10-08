import { useState } from "react";
import { Button, Flex, Table, TableProps, Tooltip, Typography } from "antd";
import { DotsThreeVertical, DownloadSimple, Paperclip, Trash, Triangle } from "phosphor-react";

import useScreenHeight from "@/components/hooks/useScreenHeight";
import { IHistoryRecord } from "../../containers/history-tab/history-tab";
import { ModalConfirmAction } from "@/components/molecules/modals/ModalConfirmAction/ModalConfirmAction";

import "./history-tab-table.scss";

const { Text } = Typography;

interface PropsHistoryTable {
  dataAllRecords: IHistoryRecord[];
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

  const tootlTipOptions = [
    {
      title: "PDF",
      icon: <DownloadSimple size={"1.2rem"} />,
      onClick: () => console.info("PDF")
    },
    {
      title: "Excel",
      icon: <DownloadSimple size={"1.2rem"} />,
      onClick: () => console.info("Excel")
    },
    {
      title: "Anular aplicación",
      icon: <Trash size={"1.2rem"} />,
      onClick: (recordId: number) => setIsConfirmCancelModalOpen({ isOpen: true, id: recordId })
    }
  ];

  const columns: TableProps<IHistoryRecord>["columns"] = [
    {
      title: "Fecha",
      dataIndex: "create_at",
      key: "create_at",
      render: (create_at) => <Text className="cell">{create_at}</Text>,
      sorter: (a, b) => a.create_at.localeCompare(b.create_at),
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
      key: "payment_amount",
      dataIndex: "payment_amount",
      render: (payment_amount, row) => (
        <span className="cell">
          Pago {<span className="highlightText">#{row.payment_id}</span>} por {payment_amount}
        </span>
      ),
      sorter: (a, b) => a.payment_amount - b.payment_amount,
      showSorterTooltip: false
    },
    {
      title: "Usuario",
      key: "user",
      dataIndex: "user",
      render: (text) => <Text className="cell">{text}</Text>,
      sorter: (a, b) => a.user.localeCompare(b.user),
      showSorterTooltip: false
    },
    {
      title: "",
      render: (_, record) => (
        <Flex gap="0.5rem">
          <Button className="eyeButton" icon={<Paperclip size={"1.2rem"} />} />
          <Tooltip
            overlayClassName="tooltipHistoryOptions"
            title={
              <Flex vertical gap={"0.5rem"}>
                {tootlTipOptions.map((option) => (
                  <Button
                    key={option.title}
                    className="tooltipButton"
                    icon={option.icon}
                    onClick={() => option.onClick(record.id)}
                  >
                    <p>{option.title}</p>
                  </Button>
                ))}
              </Flex>
            }
            color={"white"}
            key={record.id}
          >
            <Button className="eyeButton" icon={<DotsThreeVertical size={"1.2rem"} />} />
          </Tooltip>
        </Flex>
      ),
      width: 100
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
