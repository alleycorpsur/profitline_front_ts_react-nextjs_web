import React from "react";
import { Modal } from "antd";

import "./modalConfirmAction.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  title: string;
  content?: React.ReactNode;
}
export const ModalConfirmAction = ({ isOpen, onClose, onOk, title, content }: Props) => {
  return (
    <Modal
      className="ModalConfirmAction"
      width={"60%"}
      open={isOpen}
      onCancel={onClose}
      okButtonProps={{ className: "acceptButton" }}
      okText="Aceptar"
      cancelButtonProps={{
        className: "cancelButton"
      }}
      title={title}
      onOk={onOk}
    >
      {content}
    </Modal>
  );
};
