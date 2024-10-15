import React from "react";
import { Modal } from "antd";
import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";
import "./modalSelectAjustements.scss";
import { Globe, NewspaperClipping } from "phosphor-react";

type ModalActionPaymentProps = {
  isOpen: boolean;
  onClose: () => void;
  setModalAction: (modalAction: number) => void;
};

export const ModalSelectAjustements: React.FC<ModalActionPaymentProps> = ({
  isOpen,
  onClose,
  setModalAction
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Selecciona el tipo de aplicación del ajuste"
      footer={null}
      onCancel={onClose}
      className="modal-action-payment"
      centered
    >
      <div className="modal-content">
        <ButtonGenerateAction
          icon={<Globe size={20} />}
          title="Global"
          onClick={() => {
            console.log("Identificar pago clicked");
            setModalAction(1);
          }}
        />
        <ButtonGenerateAction
          icon={<NewspaperClipping size={20} />}
          title="Por factura"
          onClick={() => {
            console.log("Aplicar pagos clicked");
            setModalAction(2);
          }}
        />
      </div>
    </Modal>
  );
};
