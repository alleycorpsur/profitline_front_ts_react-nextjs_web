import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, DatePicker, Modal, Table, TableProps } from "antd";
import styles from "./wallet-tab-payment-agreement-modal.module.scss";
import { CaretLeft } from "phosphor-react";
import EvidenceModal from "../wallet-tab-evidence-modal";

interface Props {
  isOpen: boolean;
  setIsPaymentAgreementOpen: Dispatch<SetStateAction<boolean>>;
}

interface FileFromDragger {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  originFileObj: File;
  percent: number;
  size: number;
  status: string;
  type: string;
  uid: string;
}
interface FileObjectFromButton {
  file: FileFromDragger;
  fileList: FileFromDragger[];
}

const PaymentAgreementModal: React.FC<Props> = ({ isOpen, setIsPaymentAgreementOpen }) => {
  const [selectedEvidence, setSelectedEvidence] = useState<File[]>([]);
  const [commentary, setCommentary] = useState<string | undefined>();
  const [isSecondView, setIsSecondView] = useState(false);

  const onCloseModal = () => {
    setIsPaymentAgreementOpen(false);
  };

  const handleOnChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentary(e.target.value);
  };

  const handleAttachEvidence = () => {
    // Aqui se debe hacer la llamada a la API para adjuntar la evidencia
    // que esta en los estados de selectedEvidence y commentary
  };

  const handleOnChangeDocument: any = (info: FileObjectFromButton) => {
    const { file } = info;
    const rawFile = file.originFileObj;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);

      if (fileSizeInMB > 30) {
        alert("El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB.");
        return;
      }

      setSelectedEvidence([...selectedEvidence, rawFile]);
    }
  };

  const handleOnDeleteDocument = (fileName: string) => {
    const updatedFiles = selectedEvidence?.filter((file) => file.name !== fileName);
    setSelectedEvidence(updatedFiles);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);

    for (let i = 0; i < files.length; i++) {
      if (selectedEvidence.some((file) => file.name === files[i].name)) {
        alert("Ya existe un archivo con el mismo nombre");
        return;
      }
    }

    setSelectedEvidence((prevFiles) => [...prevFiles, ...files]);
  };

  const onChangeDate = (dateString: string) => {};

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
