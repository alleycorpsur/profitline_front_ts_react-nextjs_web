import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, DatePicker, Modal, Table, TableProps } from "antd";
import styles from "./wallet-tab-payment-agreement-modal.module.scss";
import { CaretLeft } from "phosphor-react";
import EvidenceModal from "../wallet-tab-evidence-modal";
import { useEvidenceModal } from "../../hooks/wallet-tab-evidence-modal/wallet-tab-evidence-modal.hook";

interface Props {
  isOpen: boolean;
  setIsPaymentAgreementOpen: Dispatch<SetStateAction<boolean>>;
}

const PaymentAgreementModal: React.FC<Props> = ({ isOpen, setIsPaymentAgreementOpen }) => {
  const [isSecondView, setIsSecondView] = useState(false);

  const {
    selectedEvidence,
    commentary,
    handleOnChangeTextArea,
    handleOnChangeDocument,
    handleOnDeleteDocument,
    handleFileChange
  } = useEvidenceModal();

  const onCloseModal = () => {
    setIsPaymentAgreementOpen(false);
  };

  const handleAttachEvidence = () => {
    // Aqui se debe hacer la llamada a la API para adjuntar la evidencia
    // que esta en los estados de selectedEvidence y commentary
  };

  const onChangeDate = (dateString: string) => {
    console.log(dateString);
  };

  return (
    <>
      <Modal
        className={styles.wrapper}
        width={"50%"}
        open={isOpen}
        onCancel={onCloseModal}
        footer={null}
      >
        {!isSecondView ? (
          <>
            <div className={styles.content}>
              <Button onClick={onCloseModal} className={styles.content__header}>
                <CaretLeft size={"1.25rem"} />
                <h4>Acuerdo de pago</h4>
              </Button>

              <p className={styles.content__description}>
                Selecciona la fecha y el valor para definir el acuerdo de pago
              </p>
              <DatePicker onChange={onChangeDate} />
              <Table
                className={styles.selectedInvoicesTable}
                columns={columns}
                // dataSource={data.map((data) => ({ ...data, key: data.id }))}
              />
            </div>
            <div className={styles.footer}>
              <Button className={styles.cancelButton} onClick={onCloseModal}>
                Cancelar
              </Button>
              <Button className={styles.acceptButton} onClick={() => setIsSecondView(true)}>
                Guardar cambios
              </Button>
            </div>
          </>
        ) : (
          <EvidenceModal
            selectedEvidence={selectedEvidence}
            handleOnChangeDocument={handleOnChangeDocument}
            handleOnDeleteDocument={handleOnDeleteDocument}
            handleFileChange={handleFileChange}
            handleOnChangeTextArea={handleOnChangeTextArea}
            handleAttachEvidence={handleAttachEvidence}
            commentary={commentary}
            setIsSecondView={setIsSecondView}
          />
        )}
      </Modal>
    </>
  );
};

const columns: TableProps<any>["columns"] = [
  {
    title: "ID Factura",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Emisión",
    dataIndex: "emission",
    key: "emission"
  },
  {
    title: "Pendiente",
    dataIndex: "pending",
    key: "pending"
  },
  {
    title: "Valor acordado",
    dataIndex: "agreedValue",
    key: "agreedValue"
  },
  {
    title: "Nueva fecha",
    dataIndex: "newDate",
    key: "newDate"
  }
];
export default PaymentAgreementModal;
