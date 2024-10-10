"use client";
import { useState } from "react";
import { Modal, Typography } from "antd";

import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import { useForm } from "react-hook-form";
import { useMessageApi } from "@/context/MessageContext";

import "./modal-actions-upload-evidence.scss";
const { Title } = Typography;

interface infoObject {
  file: File;
  fileList: File[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalActionsUploadEvidence = ({ isOpen, onClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showMessage } = useMessageApi();

  const { handleSubmit, setValue, watch, trigger, reset } = useForm<{
    evidence: File;
  }>();

  const evidence = watch("evidence");

  const handleOnChangeDocument: any = (info: infoObject) => {
    const { file: rawFile } = info;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        showMessage(
          "error",
          "El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB."
        );
        return;
      }
      setValue("evidence", rawFile);
      trigger("evidence");
    }
  };

  const handleOnDeleteDocument = () => {
    reset();
  };

  const onSubmit = async (data: { evidence: File }) => {
    setIsSubmitting(true);
    try {
      console.log("archivo enviado: ", data);

      showMessage("success", "Acta digital enviada correctamente");

      onClose();
    } catch (error) {
      showMessage("error", "Error al enviar acta digital");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      className="modalActionsUploadEvidence"
      width="50%"
      footer={null}
      open={isOpen}
      closable={false}
      destroyOnClose
    >
      <Title level={4} onClick={onClose}>
        Cargar tirilla
      </Title>

      <p className="modalActionsUploadEvidence__subTitle">Cargar el archivo correspondiente</p>

      <div className="modalActionsUploadEvidence__file">
        <p>Tirilla</p>
        <DocumentButton
          key={evidence?.name}
          title={evidence?.name}
          handleOnChange={handleOnChangeDocument}
          handleOnDelete={() => handleOnDeleteDocument()}
          fileName={evidence?.name}
          fileSize={evidence?.size}
        />
      </div>

      <div className="modalActionsUploadEvidence__footer">
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

        <PrincipalButton
          onClick={handleSubmit(onSubmit)}
          disabled={!evidence}
          loading={isSubmitting}
        >
          Cargar tirilla
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalActionsUploadEvidence;
