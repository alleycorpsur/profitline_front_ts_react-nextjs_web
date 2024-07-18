import React from "react";
import { Modal } from "antd";
import "./fileDownloadModal.scss";

interface InvoiceDownloadModalProps {
  isModalOpen: boolean;
  url: string;
  onCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileDownloadModal: React.FC<InvoiceDownloadModalProps> = ({
  isModalOpen,
  url,
  onCloseModal
}) => {
  return (
    <Modal
      title="Documento adjunto"
      className="wrapper"
      open={isModalOpen}
      footer={null}
      onCancel={() => onCloseModal(false)}
    >
      <div className="img">
        <div className="bodyImg">
          <img src={url} alt="Invoice" />
        </div>
      </div>
      <div className="footer">
        <a className="buttonDownload" download={url} href={url} target="_blank">
          Descargar
        </a>
        <button
          type="button"
          className="buttonCheck"
          onClick={() => {
            console.log("Entendido");
          }}
        >
          Entendido
        </button>
      </div>
    </Modal>
  );
};