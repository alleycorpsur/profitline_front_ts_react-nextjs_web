"use client";
import { Dispatch, SetStateAction } from "react";
import { Flex, Modal, Typography } from "antd";
import { PencilLine, User, CheckCircle, CirclesFour, FileArrowUp } from "@phosphor-icons/react";

import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";

import "./modal-actions-banks-payments.scss";

const { Title } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setSelectOpen: Dispatch<SetStateAction<{ selected: number }>>;
}

const ModalActionsBanksPayments = ({ isOpen, onClose, setSelectOpen }: Props) => {
  const handleOpenModal = (type: number) => {
    setSelectOpen({
      selected: type
    });
  };
  return (
    <Modal
      className="modalActionsBanksPayments"
      width={"40%"}
      open={isOpen}
      centered
      title={
        <Title className="modalActionsBanksPayments__title" level={4}>
          Generar acción
        </Title>
      }
      footer={null}
      onCancel={onClose}
    >
      <p className="modalActionsBanksPayments__description">
        Selecciona la acción que vas a realizar
      </p>
      <Flex vertical gap="0.75rem">
        <ButtonGenerateAction
          onClick={() => {
            handleOpenModal(1);
          }}
          icon={<PencilLine size={16} />}
          title="Editar cliente"
        />
        <ButtonGenerateAction
          icon={<User size={16} />}
          title="Asignar cliente"
          onClick={() => {
            handleOpenModal(2);
          }}
        />
        <ButtonGenerateAction
          icon={<CheckCircle size={16} />}
          title="Aprobar asignación"
          onClick={() => {
            handleOpenModal(3);
          }}
        />
        <ButtonGenerateAction
          icon={<CirclesFour size={16} />}
          title="Fraccionar pago"
          onClick={() => {
            handleOpenModal(4);
          }}
        />
        <ButtonGenerateAction
          icon={<FileArrowUp size={16} />}
          title="Cargar tirilla"
          onClick={() => {
            handleOpenModal(5);
          }}
        />
      </Flex>
    </Modal>
  );
};

export default ModalActionsBanksPayments;
