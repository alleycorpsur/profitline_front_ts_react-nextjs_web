"use client";
import { Dispatch, Key, SetStateAction, useState } from "react";
import { Flex, Modal, Typography } from "antd";
import { DownloadSimple, NewspaperClipping } from "@phosphor-icons/react";

import { useAppStore } from "@/lib/store/store";
import { useMessageApi } from "@/context/MessageContext";
import { createAndDownloadTxt } from "@/utils/utils";
import { changeOrderState, dowloadOrderCSV } from "@/services/commerce/commerce";
import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";

import { IOrder } from "@/types/commerce/ICommerce";

import "./orders-generate-action-modal.scss";
const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ordersId: number[];
  setFetchMutate: Dispatch<SetStateAction<boolean>>;
  setSelectedRows: Dispatch<SetStateAction<IOrder[] | undefined>>;
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

export const OrdersGenerateActionModal = ({
  isOpen,
  onClose,
  ordersId,
  setFetchMutate,
  setSelectedRows,
  setSelectedRowKeys
}: Props) => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const { showMessage } = useMessageApi();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeOrderState = async () => {
    try {
      await changeOrderState(ordersId, showMessage);
      setFetchMutate((prev) => !prev);
      setSelectedRows([]);
      setSelectedRowKeys([]);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await dowloadOrderCSV(ordersId, projectId);
      if (!res) {
        return showMessage("error", "Error al descargar CSV");
      }
      createAndDownloadTxt(res.data);
      if (res.message == "Order Ids correctos") {
        showMessage("success", "Descarga exitosa");
      } else {
        setErrorMessage(res?.message);
        setIsErrorModalOpen(true);
      }
      setFetchMutate((prev) => !prev);
      setSelectedRows([]);
      setSelectedRowKeys([]);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        className="ordersGenerateActionModal"
        width={"45%"}
        open={isOpen}
        centered
        title={
          <Title className="ordersGenerateActionModal__title" level={4}>
            Generar acción
          </Title>
        }
        footer={null}
        onCancel={onClose}
      >
        <p className="ordersGenerateActionModal__description">
          Selecciona la acción que vas a realizar
        </p>
        <Flex vertical gap="0.75rem">
          <ButtonGenerateAction
            onClick={handleChangeOrderState}
            icon={<NewspaperClipping size={16} />}
            title="Enviar pedido a facturado"
          />
          <ButtonGenerateAction
            onClick={handleDownloadCSV}
            icon={<DownloadSimple size={16} />}
            title="Descargar CSV"
          />
        </Flex>
      </Modal>

      <Modal
        open={isErrorModalOpen}
        onCancel={() => setIsErrorModalOpen(false)}
        footer={null}
        centered
        title={<Title level={4}>Descarga de plano de facturación</Title>}
      >
        <Flex vertical gap={12}>
          <Text strong>{errorMessage}</Text>
        </Flex>
      </Modal>
    </>
  );
};
