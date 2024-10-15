import React from "react";
import { Modal } from "antd";
import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";
import { MagnifyingGlassPlus, HandTap, PushPin } from "@phosphor-icons/react";
import "./modalActionPayment.scss";

type ModalActionPaymentProps = {
  isOpen: boolean;
  onClose: () => void;
  onChangeTab: (activeKey: string) => void;
};

export const ModalActionPayment: React.FC<ModalActionPaymentProps> = ({
  isOpen,
  onClose,
  onChangeTab
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Selecciona la acción que vas a realizar"
      footer={null}
      onCancel={onClose}
      className="modal-action-payment"
      centered
    >
      <div className="modal-content">
        <ButtonGenerateAction
          icon={<MagnifyingGlassPlus size={20} />}
          title="Identificar pago"
          onClick={() => {
            console.log("Identificar pago clicked");
          }}
        />
        <ButtonGenerateAction
          icon={<HandTap size={20} />}
          title="Aplicar pagos"
          onClick={() => {
            console.log("Aplicar pagos clicked");

            onChangeTab("5");
          }}
        />
        <ButtonGenerateAction
          icon={<PushPin size={20} />}
          title="Cambiar de estado"
          onClick={() => {
            console.log("Cambiar de estado clicked");
          }}
        />
      </div>
    </Modal>
  );
};
