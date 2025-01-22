"use client";
import { Flex, Modal } from "antd";
import { X } from "@phosphor-icons/react";

import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";

import "./history-tab-modal-generate-action.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  setSelectOpen: (args: { selected: number }) => void;
}

const ModalActionsHistoryTab = ({ isOpen, onClose, setSelectOpen }: Props) => {
  const handleOpenModal = (type: number) => {
    setSelectOpen({
      selected: type
    });
  };
  return (
    <Modal
      className="modalActionsHistoryTab"
      width={686}
      open={isOpen}
      title={null}
      footer={null}
      onCancel={onClose}
    >
      <p className="modalActionsHistoryTab__description">Selecciona la acción que vas a realizar</p>
      <Flex vertical gap="0.75rem">
        <ButtonGenerateAction
          onClick={() => {
            handleOpenModal(2);
          }}
          icon={<X size={16} />}
          title="Anular pago"
        />
      </Flex>
    </Modal>
  );
};

export default ModalActionsHistoryTab;
