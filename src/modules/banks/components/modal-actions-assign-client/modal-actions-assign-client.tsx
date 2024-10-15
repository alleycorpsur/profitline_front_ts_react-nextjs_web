"use client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flex, Modal, Typography } from "antd";

import { useMessageApi } from "@/context/MessageContext";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import GeneralSelect from "@/components/ui/general-select";

import "./modal-actions-assign-client.scss";
const { Title } = Typography;

interface infoObject {
  file: File;
  fileList: File[];
}

interface ISelect {
  value: string;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalActionsAssignClient = ({ isOpen, onClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showMessage } = useMessageApi();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isValid }
  } = useForm<{
    client: ISelect[];
    evidence: File | undefined;
  }>();

  const evidence = watch("evidence");

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isOpen]);

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
    setValue("evidence", undefined);
    trigger("evidence");
  };

  const onSubmit = async (data: { evidence: File | undefined }) => {
    setIsSubmitting(true);
    try {
      console.info("asignacion enviada: ", data);

      showMessage("success", "Cliente asignado correctamente");

      onClose();
    } catch (error) {
      showMessage("error", "Error al asignar cliente digital");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      className="modalActionsAssignClient"
      width="50%"
      footer={null}
      open={isOpen}
      closable={false}
      destroyOnClose
    >
      <Title level={4} onClick={onClose}>
        Asignar cliente
      </Title>

      <p className="modalActionsAssignClient__subTitle">
        Selecciona el cliente para asignar al pago
      </p>

      <Controller
        name="client"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <GeneralSelect
            errors={errors.client}
            field={field}
            title="Cliente"
            placeholder="Buscar cliente"
            options={clients}
            titleAbsolute
            showSearch
            customStyleContainer={{ width: "50%" }}
          />
        )}
      />

      <div className="modalActionsAssignClient__file">
        <Flex vertical>
          <p>Evidencia</p>
          <em>*Obligatorio</em>
        </Flex>
        <DocumentButton
          key={evidence?.name}
          title={evidence?.name}
          handleOnChange={handleOnChangeDocument}
          handleOnDelete={() => handleOnDeleteDocument()}
          fileName={evidence?.name}
          fileSize={evidence?.size}
        />
      </div>

      <div className="modalActionsAssignClient__footer">
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

        <PrincipalButton
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || !evidence}
          loading={isSubmitting}
        >
          Asignar cliente
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalActionsAssignClient;

const clients = [
  {
    value: "1",
    label: "Cliente 1"
  },
  {
    value: "2",
    label: "Cliente 2"
  },
  {
    value: "3",
    label: "Cliente 3"
  },
  {
    value: "4",
    label: "Cliente 4"
  },
  {
    value: "5",
    label: "Cliente 5"
  }
];
