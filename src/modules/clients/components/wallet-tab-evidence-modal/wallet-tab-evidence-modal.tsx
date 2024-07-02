/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Flex, UploadFile } from "antd";
import { CaretLeft, Plus } from "@phosphor-icons/react";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import styles from "./wallet-tab-evidence-modal.module.scss";
import { UploadChangeParam } from "antd/es/upload";

type EvidenceModalProps = {
  selectedEvidence: File[];
  handleOnChangeDocument: (info: UploadChangeParam<UploadFile<any>>) => void;
  handleOnDeleteDocument: (fileName: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnChangeTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAttachEvidence: () => void;
  commentary?: string;
  setIsSecondView: React.Dispatch<React.SetStateAction<boolean>>;
};

const EvidenceModal = ({
  selectedEvidence,
  handleOnChangeDocument,
  handleOnDeleteDocument,
  handleFileChange,
  handleOnChangeTextArea,
  handleAttachEvidence,
  commentary,
  setIsSecondView
}: EvidenceModalProps) => {
  return (
    <div className={styles.content}>
      <button className={styles.content__header} onClick={() => setIsSecondView(false)}>
        <CaretLeft size={"1.25rem"} />
        <h4>Evidencia</h4>
      </button>
      <p className={styles.content__description}>Adjunta la evidencia e ingresa un comentario</p>
      <div className={styles.content__evidence}>
        <Flex vertical>
          <p>Evidencia</p>
          <em className="descriptionDocument">*Obligatorio</em>
        </Flex>
        <DocumentButton
          title={selectedEvidence[0]?.name}
          handleOnChange={handleOnChangeDocument}
          handleOnDelete={() => handleOnDeleteDocument(selectedEvidence[0]?.name)}
          fileName={selectedEvidence[0]?.name}
          fileSize={selectedEvidence[0]?.size}
        />
        {selectedEvidence.length > 0 &&
          selectedEvidence
            .slice(1)
            .map((file) => (
              <DocumentButton
                key={file.name}
                className={styles.documentButton}
                title={file.name}
                handleOnChange={handleOnChangeDocument}
                handleOnDelete={() => handleOnDeleteDocument(file.name)}
                fileName={file.name}
                fileSize={file.size}
              />
            ))}
        {selectedEvidence.length > 0 && (
          <>
            <Button
              onClick={() => {
                const fileInput = document.getElementById("fileInput");
                if (fileInput) {
                  fileInput.click();
                }
              }}
              className={styles.addDocument}
              icon={<Plus size={"1rem"} />}
            >
              <p>Cargar otro documento</p>
            </Button>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.png,.doc,.docx"
            />
          </>
        )}

        <p>Comentarios</p>
        <textarea onChange={handleOnChangeTextArea} placeholder="Ingresar un comentario" />
      </div>
      <div className={styles.footer}>
        <Button className={styles.cancelButton} onClick={() => setIsSecondView(false)}>
          Cancelar
        </Button>
        <Button
          onClick={handleAttachEvidence}
          disabled={commentary && selectedEvidence.length > 0 ? false : true}
          className={styles.acceptButton}
        >
          Adjuntar evidencia
        </Button>
      </div>
    </div>
  );
};

export default EvidenceModal;
