import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Flex, Modal } from "antd";
import { FileArrowUp } from "phosphor-react";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import GeneralSearchSelect from "@/components/ui/general-search-select";

import "./history-tab-modal-communication-detail.scss";

interface DigitalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ISelect {
  value: string;
  label: string;
}
export interface IFormDigitalRecordModal {
  forward_to: ISelect[];
  copy_to?: ISelect[];
  subject: string;
  body: string;
  attachments: File[];
}

const ModalCommunicationDetail = ({ isOpen, onClose }: DigitalRecordModalProps) => {
  const { control, setValue, watch, reset } = useForm<IFormDigitalRecordModal>({
    defaultValues: {
      attachments: []
    }
  });

  useEffect(() => {
    const fetchFormInfo = async () => {
      try {
        const response = {
          forward_to: [
            {
              value: "1",
              label: "Juan Perez"
            },
            {
              value: "2",
              label: "Maria Lopez"
            }
          ],
          copy_to: [
            {
              value: "1",
              label: "Juan Perez"
            },
            {
              value: "2",
              label: "Maria Lopez"
            }
          ],
          subject: "Solicitud de información",
          body: "Caliquet lacus aliquam quis. Maecenas pretium dapibus dolor, vitae convallis risus suscipit vel. Curabitur et maximus leo. Vivamus lacinia rhoncus ante, eu semper sapien luctus eget. Cras feugiat in nunc vel rhoncus. Etiam quam mauris, luctus eget felis in, porttitor tempor mauris. Cras quam purus, accumsan eget consectetur in, dapibus vitae enim. Ut mattis ex in dui elementum scelerisque. Praesent lobortis tempor dapibus.",
          attachments: [
            {
              name: "example-document-1.pdf",
              size: "2.5MB"
            },
            {
              name: "example-image-1.pngexample-image-1.pngexample-image-1.pngexample-image-1.pngexample-image-1.png",
              size: "1.8MB"
            }
          ]
        };

        setValue("forward_to", response.forward_to);
        setValue("copy_to", response.copy_to);
        setValue("subject", response.subject);
        setValue("body", response.body);
        setValue("attachments", response.attachments as unknown as File[]);
      } catch (error) {
        console.error("Error getting digital record form info2", error);
      }
    };
    fetchFormInfo();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const attachments = watch("attachments");

  return (
    <Modal
      className="modalCommunicationDetail"
      width="690px"
      footer={null}
      open={isOpen}
      onCancel={onClose}
    >
      <h2 className="modalCommunicationDetail__title">Correo enviado</h2>

      <Flex vertical gap="1.5rem">
        <Controller
          name="forward_to"
          control={control}
          render={({ field }) => (
            <GeneralSearchSelect
              field={field}
              title="Para"
              placeholder=""
              suffixIcon={null}
              disabled
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
              field={field}
              title="CC"
              placeholder=""
              suffixIcon={null}
              disabled
              showLabelAndValue
            />
          )}
        />

        <InputForm
          validationRules={{ required: true }}
          titleInput="Asunto"
          control={control}
          nameInput="subject"
          readOnly
        />

        <Controller
          name="body"
          control={control}
          rules={{ required: true }}
          disabled
          render={({ field }) => (
            <div className="modalCommunicationDetail__textArea">
              <textarea {...field} placeholder="" />
            </div>
          )}
        />

        <div>
          <div className="modalCommunicationDetail__files">
            {attachments.map((file) => (
              <div className="modalCommunicationDetail__files__file" key={file.name}>
                <FileArrowUp size={"25px"} />
                <p className="nameFile">{file.name}</p>
                <p className="sizeFile">{file.size}</p>
              </div>
            ))}
          </div>
        </div>
      </Flex>
    </Modal>
  );
};

export default ModalCommunicationDetail;
