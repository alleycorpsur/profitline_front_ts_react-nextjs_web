import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Flex, Table, TableProps, Typography, DatePicker } from "antd";
import { DotsThree } from "phosphor-react";
import styles from "./TRMView.module.scss";
import { useAppStore } from "@/lib/store/store";
import { TRMRow } from "@/types/trm";
import { getTRMList } from "@/services/trm/trm";
import { mockedTRMRows } from "@/types/trm/mocked-data";
import { formatDate, formatNumber } from "@/utils/utils";
import NoData from "@/components/atoms/NoData";
import { ModalGenerateActionTRM } from "@/components/molecules/modals/ModalGenerateActionTRM";
import dayjs, { Dayjs } from "dayjs";
import FilterTRMs, { FilterOption } from "@/components/atoms/Filters/FilterTRMs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const TRMsTable = () => {
  const [TRMList, setTRMList] = useState<TRMRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilterKeys, setSelectedFilterKeys] = useState<FilterOption[]>([]);
  const loading = false;
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setStartDate(dates[0] || null);
      setEndDate(dates[1] || null);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  useEffect(() => {
    const fetchTRMList = async () => {
      const response = await getTRMList(projectId);
      setTRMList(mockedTRMRows);
      //setTRMList([]);
    };
    fetchTRMList();
  }, [projectId]);
  const [columns, setColumns] = useState<TableProps<TRMRow>["columns"]>([]);

  useEffect(() => {
    const dynamicColumns = selectedFilterKeys.map((filter) => ({
      title: filter.label, // Usamos el label como el título de la columna
      dataIndex: filter.value, // El value de la opción seleccionada será el dataIndex
      key: filter.value, // El value también será el key
      render: (value: any) => <Text>{value ? `$${formatNumber(value)}` : ""}</Text>,
      showSorterTooltip: false
    }));

    // Siempre mantenemos la columna "Fecha" al principio
    setColumns([
      {
        title: "Fecha",
        dataIndex: "date",
        key: "date",
        render: (text) => <Text>{formatDate(text)}</Text>,
        showSorterTooltip: false
      },
      ...dynamicColumns
    ]);
  }, [selectedFilterKeys]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRow: any) => {
    console.log("newSelectedRowKeys", newSelectedRowKeys);
    console.log("newSelectedRow", newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRow);
  };

  const rowSelection = {
    columnWidth: 20,
    selectedRowKeys,
    onChange: onSelectChange
  };

  console.log("startDate", startDate);
  console.log("endDate", endDate);
  console.log("selectedFilterKeys", selectedFilterKeys);
  return (
    <main className={styles.trmView}>
      <Flex justify="space-between">
        <Flex gap={"0.625rem"}>
          <RangePicker
            placeholder={["Desde", "Hasta"]}
            separator={"|"}
            onChange={handleDateChange}
          />
          <FilterTRMs selectedKeys={selectedFilterKeys} setSelectedKeys={setSelectedFilterKeys} />
          <Button
            className={styles.button__actions}
            size="large"
            disabled={false}
            icon={<DotsThree size={"1.5rem"} />}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Generar acción
          </Button>
        </Flex>
      </Flex>

      {(TRMList.length === 0 && !loading) || selectedFilterKeys.length === 0 ? (
        <NoData />
      ) : (
        <Table
          className={styles.trmsTable}
          columns={columns}
          dataSource={TRMList}
          rowKey={"id"}
          loading={loading}
          rowSelection={rowSelection}
        />
      )}
      <ModalGenerateActionTRM
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRates={selectedFilterKeys}
        startDate={startDate}
        endDate={endDate}
        selectedRowKeys={selectedRowKeys}
      />
    </main>
  );
};
