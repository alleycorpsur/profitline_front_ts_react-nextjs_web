import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flex, Modal } from "antd";
import { CaretLeft } from "phosphor-react";

import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import GeneralSearchSelect from "@/components/ui/general-search-select";

import "./modalSendEmail.scss";

interface ISelect {
  value: string;
  label: string;
}

interface IFormEmailNotification {
  forward_to: ISelect[];
  copy_to?: ISelect[];
  subject: string;
  body: string;
  attachments: File[];
}

type IView = "sendEmail" | "template" | "success";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: string;
}
export const ModalSendEmail = ({ isOpen, onClose }: Props) => {
  const [currentView, setCurrentView] = useState<IView>("sendEmail");

  const { control, setValue, watch, reset } = useForm<IFormEmailNotification>({
    defaultValues: {
      attachments: []
    }
  });

  //reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleAcceptSendingEmail = () => {
    // send email request to verify template
    //change view to template
    setCurrentView("template");
    // if a template its returned assign values to form with response
  };

  const handleSendEmail = () => {
    // send email
    console.log("Send email");
    //if success change view to success
    setCurrentView("success");
  };

  return (
    <Modal
      className="modalSendEmail"
      width={"686px"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {currentView === "sendEmail" && (
        <>
          <h2 className="modalSendEmail__title">{sendEmailConstants.title}</h2>

          <p className="modalSendEmail__description">{sendEmailConstants.description}</p>
          <div className="modalSendEmail__footer">
            <SecondaryButton onClick={() => onClose()}>
              {sendEmailConstants.cancelText}
            </SecondaryButton>

            <PrincipalButton onClick={handleAcceptSendingEmail}>
              {sendEmailConstants.okText}
            </PrincipalButton>
          </div>
        </>
      )}

      {currentView === "template" && (
        <>
          <button className="modalSendEmail__goBackBtn" onClick={onClose}>
            <CaretLeft size="1.25rem" />
            {templateConstants.title}
          </button>
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
                  showLabelAndValue
                />
              )}
            />

            <InputForm
              validationRules={{ required: true }}
              titleInput="Asunto"
              control={control}
              nameInput="subject"
              placeholder=" "
            />

            <Controller
              name="body"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="modalCommunicationDetail__textArea">
                  <textarea {...field} placeholder="" />
                </div>
              )}
            />
          </Flex>
          <div className="modalSendEmail__footer">
            <SecondaryButton onClick={() => onClose()}>
              {templateConstants.cancelText}
            </SecondaryButton>

            <PrincipalButton onClick={handleSendEmail}>{templateConstants.okText}</PrincipalButton>
          </div>
        </>
      )}

      {currentView === "success" && (
        <>
          <h2 className="modalSendEmail__title">{successConstants.title}</h2>

          <div className="modalSendEmail__description" style={{ maxWidth: "90%" }}>
            <p>{successConstants.description}</p>
            <p>
              {recipients
                .map((recipient, index) =>
                  index === recipients.length - 1 ? `y ${recipient}` : `${recipient},`
                )
                .join(" ")}
            </p>
          </div>

          <Flex justify="center" style={{ alignSelf: "center", height: "3rem", width: "320px" }}>
            <PrincipalButton fullWidth onClick={() => setCurrentView("sendEmail")}>
              {successConstants.okText}
            </PrincipalButton>
          </Flex>
        </>
      )}
    </Modal>
  );
};

const sendEmailConstants = {
  title: "¿Deseas enviar un correo notificando esta acción?",
  description: "Se enviará un correo a los aprobadores notificando esta acción",
  okText: "Sí, enviar correo",
  cancelText: "No, no enviar"
};

const templateConstants = {
  title: "Enviar correo",
  okText: "Enviar correo",
  cancelText: "Cancelar"
};

const successConstants = {
  title: "Correo enviado exitosamente",
  description: "Se ha enviado el correo a:",
  okText: "Entendido"
};

const recipients = ["Juan Perez", "Maria Lopez", "Pedro Ramirez", "Carlos Rodriguez"];
