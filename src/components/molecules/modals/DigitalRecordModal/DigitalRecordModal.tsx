import React, { useEffect, useState } from "react";
import { Button, Flex, Modal } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { CaretLeft, Plus } from "@phosphor-icons/react";

import { useAppStore } from "@/lib/store/store";
import {
  createDigitalRecord,
  getDigitalRecordFormInfo
} from "@/services/accountingAdjustment/accountingAdjustment";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import { useForm, Controller, FieldError } from "react-hook-form";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import GeneralSearchSelect from "@/components/ui/general-search-select";

import { IInvoice } from "@/types/invoices/IInvoices";

import "./digitalRecordModal.scss";

interface DigitalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  invoiceSelected: IInvoice[] | undefined;
  messageShow: MessageInstance;
}

interface infoObject {
  file: File;
  fileList: File[];
}

interface ISelect {
  value: string;
  label: string;
}
export interface IFormDigitalRecordModal {
  forward_to: ISelect[];
  copy_to?: ISelect[];
  subject: string;
  comment: string;
  attachments: File[];
}

const DigitalRecordModal = ({
  isOpen,
  onClose,
  invoiceSelected,
  messageShow
}: DigitalRecordModalProps) => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [recipients, setRecipients] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const userId = useAppStore((state) => state.userId);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
    reset
  } = useForm<IFormDigitalRecordModal>({
    defaultValues: {
      attachments: []
    }
  });

  useEffect(() => {
    const fetchFormInfo = async () => {
      try {
        const response = await getDigitalRecordFormInfo(projectId);
        setRecipients(response.usuarios);
        setValue("subject", response.asunto);
      } catch (error) {
        console.error("Error getting digital record form info2", error);
      }
    };
    fetchFormInfo();
  }, [projectId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  const attachments = watch("attachments");

  const handleOnChangeDocument: any = (info: infoObject) => {
    const { file: rawFile } = info;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        messageShow.error(
          "El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB."
        );
        return;
      }
      setValue("attachments", [...attachments, rawFile]);
      trigger("attachments");
    }
  };

  const handleOnDeleteDocument = (fileName: string) => {
    const updatedFiles = attachments.filter((file: any) => file.name !== fileName);
    setValue("attachments", updatedFiles);
    trigger("attachments");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        messageShow.error(
          "El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB."
        );
        return;
      }
      setValue("attachments", [...attachments, file]);
      trigger("attachments");
    }
  };

  const onSubmit = async (data: IFormDigitalRecordModal) => {
    try {
      await createDigitalRecord(
        data,
        invoiceSelected?.map((invoice) => invoice.id) || [],
        projectId,
        userId
      );

      messageShow.success("Acta digital enviada correctamente");
    } catch (error) {
      messageShow.error("Error al enviar acta digital");
    }
  };

  return (
    <Modal
      className="digitalRecordModal"
      width="50%"
      footer={null}
      open={isOpen}
      closable={false}
      destroyOnClose
    >
      <button className="digitalRecordModal__goBackBtn" onClick={onClose}>
        <CaretLeft size="1.25rem" />
        Enviar acta digital
      </button>

      <Flex vertical gap="1rem">
        <Controller
          name="forward_to"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <GeneralSearchSelect
              errors={errors.forward_to}
              field={field}
              title="Para"
              placeholder=""
              options={recipients}
              suffixIcon={null}
              showLabelAndValue
            />
          )}
        />

        <Controller
          name="copy_to"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <GeneralSearchSelect
              errors={errors.copy_to}
              field={field}
              title="CC"
              placeholder=""
              options={recipients}
              suffixIcon={null}
              showLabelAndValue
            />
          )}
        />

        <InputForm
          validationRules={{ required: true }}
          titleInput="Asunto"
          control={control}
          nameInput="subject"
          error={errors.subject}
          readOnly
        />

        <Controller
          name="comment"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="digitalRecordModal__textArea">
              <p className="digitalRecordModal__textArea__label">Observaciones</p>
              <textarea
                {...field}
                placeholder=""
                style={errors.comment ? { borderColor: "red" } : {}}
              />
            </div>
          )}
        />

        <div>
          <p className="digitalRecordModal__titleInput">Adjuntos</p>
          <Flex className="digitalRecordModal__files" vertical gap="0.7rem">
            <DocumentButton
              key={attachments[0]?.name}
              title={attachments[0]?.name}
              handleOnChange={handleOnChangeDocument}
              handleOnDelete={() => handleOnDeleteDocument(attachments[0]?.name)}
              fileName={attachments[0]?.name}
              fileSize={attachments[0]?.size}
            />
            {attachments.slice(1).map((file, index) => (
              <DocumentButton
                key={file.name}
                className={index > 0 ? "documentButton" : ""}
                title={file.name}
                handleOnChange={handleOnChangeDocument}
                handleOnDelete={() => handleOnDeleteDocument(file.name)}
                fileName={file.name}
                fileSize={file.size}
              />
            ))}
            {attachments.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    const fileInput = document.getElementById("fileInput");
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  className="digitalRecordModal__addDocument"
                  icon={<Plus size={"1rem"} />}
                >
                  <p>Cargar otro documento</p>
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.doc,.docx, .xls, .xlsx, .msg,  .eml"
                />
              </>
            )}
            {errors.attachments && (
              <p className="error">{(errors.attachments as FieldError).message}</p>
            )}
          </Flex>
        </div>
      </Flex>

      <div className="digitalRecordModal__footer">
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

        <PrincipalButton
          onClick={handleSubmit(onSubmit)}
          disabled={attachments.length === 0 || !isValid}
        >
          Enviar acta
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default DigitalRecordModal;
