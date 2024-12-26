"use client";
import { Button, DatePicker, Flex, List, message, Modal, Table, Typography } from "antd";
import { X } from "@phosphor-icons/react";
import styles from "./ModalGenerateActionTRM.module.scss";
import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";
import { useEffect, useState } from "react";
import FooterButtons from "@/components/atoms/FooterButtons/FooterButtons";
import { ColumnsType } from "antd/es/table";
import { FilterOption } from "@/components/atoms/Filters/FilterTRMs";
import { Dayjs } from "dayjs";
import InputCurrency from "@/components/atoms/inputs/InputCurrency/InputCurrency";
import ChangeSummary from "./components/ChangeSummary";
import InputNumber from "@/components/atoms/inputs/InputNumber/InputNumber";

const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  selectedRates: FilterOption[];
  selectedRowKeys: React.Key[];
}
export interface ExchangeRate {
  key: string;
  currency: string;
  newRate: number;
}
interface ChangeSummaryProps {
  dateChanges: {
    date: string;
    fromCurrency: string;
    toCurrency: string;
    oldRate: number;
    newRate: number;
  }[];
}
export const ModalGenerateActionTRM = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  selectedRates,
  selectedRowKeys
}: Props) => {
  console.log("selectedKeys", selectedRates);
  const [view, setView] = useState<"select-action" | "generate-trm" | "change-summary">(
    "select-action"
  );
  console.log("modal selectedRowKeys", selectedRowKeys);
  const [formState, setFormState] = useState<"create" | "edit">("create");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    if (selectedRates.length > 0 && isOpen) {
      const newExchangeRates = selectedRates.map((key, index) => ({
        key: `${index + 1}`,
        currency: `${key.label}`,
        newRate: 0
      }));
      setExchangeRates(newExchangeRates);
    }
  }, [isOpen, selectedRates]);

  useEffect(() => {
    const allValuesSet = exchangeRates.every((rate) => rate.newRate > 0);
    setIsConfirmDisabled(!allValuesSet);
  }, [exchangeRates]);

  useEffect(() => {
    if (isOpen) {
      setView("select-action");
      if (selectedRowKeys.length > 0) {
        setFormState("edit");
      } else {
        setFormState("create");
      }
    }
  }, [isOpen, selectedRowKeys]);

  // useEffect(() => {
  //   if (selectedRowKeys.length > 0 && isOpen) {
  //     setFormState("edit");
  //   } else setFormState("create");
  // }, [selectedRowKeys]);

  console.log("exchangeRates", exchangeRates);

  const handleEditValue = (key: string, newValue: number) => {
    const updatedRates = exchangeRates.map((rate) =>
      rate.key === key ? { ...rate, newRate: newValue } : rate
    );
    setExchangeRates(updatedRates);
  };

  const columns: ColumnsType<ExchangeRate> = [
    {
      title: "Divisa",
      dataIndex: "currency",
      key: "currency",
      width: "50%",
      align: "center"
    },
    {
      title: "Valor",
      dataIndex: "newRate",
      key: "newRate",
      width: "50%",
      align: "center",
      render: (value, record) => (
        <InputCurrency
          // style={{ paddingLeft: "24px" }}
          value={value}
          onChange={(e) => handleEditValue(record.key, Number(e))}
        />
        // <InputNumber value={value} onChange={(e) => handleEditValue(record.key, Number(e))} />
      )
    }
  ];

  const renderView = () => {
    const viewMap = {
      "select-action": (
        <Flex vertical gap="0.75rem">
          <ButtonGenerateAction
            onClick={() => {
              setView("generate-trm");
            }}
            icon={<></>}
            title="Generar TRM"
            disabled={selectedRates.length === 0 || !startDate || !endDate}
          />
        </Flex>
      ),
      "generate-trm": (
        <Flex vertical gap={24}>
          <Flex gap={24}>
            <Flex vertical gap={4} flex={1}>
              <Text type="secondary" strong>
                Desde
              </Text>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Desde"
                value={startDate}
                disabled
              />
            </Flex>
            <Flex vertical gap={4} flex={1}>
              <Text type="secondary" strong>
                Hasta
              </Text>
              <DatePicker style={{ width: "100%" }} placeholder="Hasta" value={endDate} disabled />
            </Flex>
          </Flex>
          <Table
            columns={columns}
            dataSource={exchangeRates}
            pagination={false}
            rowKey="key"
            className={styles.alternatingRowsTable}
          />
        </Flex>
      ),
      "change-summary": (
        <ChangeSummary
          //dateChanges={dateChangesData}
          loadingSubmit={loadingSubmit}
          onClose={onClose}
          handleConfirm={onSubmit}
          selectedRowKeys={selectedRowKeys}
          exchangeRates={exchangeRates}
        />
      )
    };

    return viewMap[view] || viewMap["select-action"];
  };
  const handleConfirm = () => {
    if (formState === "edit") {
      setView("change-summary");
    } else {
      onSubmit();
    }
  };
  const onSubmit = async () => {
    setLoadingSubmit(true);
    try {
      console.log("selectedOrder");
      // const orderIds = [selectedOrder];
      // await updateWarehouse(orderIds, warehouseSelected as number);
      // message.success("Bodega actualizada", 2, onClose);
      // setFetchMutate((prev) => !prev);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Error al actualizar la bodega",
        3,
        onClose
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal
      width={"40%"}
      open={isOpen}
      centered
      title={
        <Flex
          gap={8}
          align="center"
          style={{
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Title level={4} style={{ marginBottom: 0 }}>
            {view === "select-action" ? "Generar acción" : " Nueva TRM"}
          </Title>
          <Button icon={<X size={"24px"} />} className={styles.removebutton} onClick={onClose} />
        </Flex>
      }
      styles={{ body: { maxHeight: "30rem", overflowY: "auto", paddingRight: "0.5rem" } }}
      footer={
        view === "generate-trm" && (
          <FooterButtons
            titleConfirm="Guardar cambios"
            onClose={onClose}
            handleOk={handleConfirm}
            isConfirmDisabled={isConfirmDisabled}
            isConfirmLoading={loadingSubmit}
          />
        )
      }
      onCancel={onClose}
      closeIcon={null}
      loading={false}
    >
      {renderView()}
    </Modal>
  );
};
