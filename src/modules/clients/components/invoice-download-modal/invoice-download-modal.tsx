import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "antd";
import styles from "./invoice-download-modal.module.scss";

interface InvoiceDownloadModalProps {
  isModalOpen: boolean;
  handleCloseModal: Dispatch<SetStateAction<boolean>>;
  url?: string;
}

const InvoiceDownloadModal: React.FC<InvoiceDownloadModalProps> = ({
  url,
  isModalOpen,
  handleCloseModal
}) => {
  return (
    <>
      <Modal
        title="Factura"
        className={styles.wrapper}
        open={isModalOpen}
        footer={null}
        onCancel={() => handleCloseModal(false)}
      >
        <div className={styles.img}>
          <div className={styles.bodyImg}>
            {url ? (
              <img src={url} alt="imgDetail" />
            ) : (
              <img
                src="https://static.wixstatic.com/media/f74a3f_08dd7ce06f544922928adb1227fdf2db~mv2.png"
                alt=""
              />
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.buttonDownload}>
            <a download={url} href={url} target="_blank">
              Descargar
            </a>
          </div>
          <div
            className={styles.buttonCheck}
            onClick={() => {
              handleCloseModal(false);
            }}
          >
            Entendido
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InvoiceDownloadModal;
