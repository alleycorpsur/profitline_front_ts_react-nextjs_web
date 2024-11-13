import { FC, useState } from "react";
import { ArrowLineDown } from "phosphor-react";
import { Flex } from "antd";

import { formatMoney } from "@/utils/utils";

import TimelineEvents from "@/components/ui/timeline-events";
import InvoiceDownloadModal from "@/modules/clients/components/invoice-download-modal";

import { IEvent } from "@/types/banks/IBanks";

import styles from "./modalDetailPaymentEvents.module.scss";

interface ModalDetailPaymentProps {
  paymentEvents: IEvent[] | undefined;
  // eslint-disable-next-line no-unused-vars
  handleOpenPaymentDetail?: (paymentId: number) => void;
}

const ModalDetailPaymentEvents: FC<ModalDetailPaymentProps> = ({
  paymentEvents,
  handleOpenPaymentDetail
}) => {
  const [isModalFileDetailOpen, setIsModalFileDetailOpen] = useState<boolean>(false);
  const [urlStep, setUrlStep] = useState<string>("");

  const handleDocumentClick = (documentUrl: string) => {
    const fileExtension = documentUrl?.split(".").pop()?.toLowerCase() ?? "";
    if (["png", "jpg", "jpeg"].includes(fileExtension)) {
      setUrlStep(documentUrl);
      if (isModalFileDetailOpen === false) setIsModalFileDetailOpen(true);
    } else {
      window.open(documentUrl, "_blank");
    }
  };

  const items = paymentEvents?.map((event) => {
    const leftIcon = event.files ? (
      <ArrowLineDown
        size={14}
        onClick={() => {
          handleDocumentClick(event?.files[0] || "");
        }}
      />
    ) : null;

    const content = (
      <div className={styles.modalDetailPaymentEvents__eventContent}>
        {event.USER_NAME && <p className={styles.regularEntry}>Responsable: {event.USER_NAME}</p>}

        {event.id_payment_parent && (
          <Flex gap={"0.2rem"} wrap="wrap">
            <p className={styles.regularEntry}>Id del pago padre:</p>
            <p
              className={styles.linkEntry}
              onClick={() => {
                handleOpenPaymentDetail && handleOpenPaymentDetail(event.id_payment_parent);
              }}
            >
              {event.id_payment_parent}
            </p>
          </Flex>
        )}

        {event.client_name &&
          (event.payments_events_types_name === "Identificacion" ||
            event.payments_events_types_name === "identificación automática") && (
            <p className={styles.regularEntry}>Cliente: {event.client_name}</p>
          )}

        {event.previous_name_client && (
          <p className={styles.regularEntry}>Cliente previo: {event.previous_name_client}</p>
        )}
        {event.payments_events_types_name === "Cambio de cliente asignado" && (
          <p className={styles.regularEntry}>Nuevo cliente: {event.client_name}</p>
        )}

        {event.payments_events_types_name === "Aplicacion de pagos" && (
          <>
            {event.id_payment_parent && (
              <p className={styles.regularEntry}>
                Id de la aplicación: ${event.id_aplication_payment}
              </p>
            )}

            <p className={styles.regularEntry}>
              Valor aplicado: {formatMoney(event.ammount_applied)}
            </p>
            <Flex gap={"0.2rem"} wrap="wrap">
              <p className={styles.regularEntry}>Id de las facturas:</p>

              {event.ids_split_payment?.map((id, index) => (
                <p
                  key={id}
                  className={styles.linkEntry}
                  onClick={() => handleOpenPaymentDetail && handleOpenPaymentDetail(id)}
                >
                  {id}
                  {event.ids_split_payment && index === event.ids_split_payment.length - 1
                    ? ""
                    : ","}
                </p>
              ))}
            </Flex>
          </>
        )}

        {event.comments && <p className={styles.regularEntry}>Comentarios: {event.comments}</p>}
      </div>
    );

    return {
      id: event.id,
      title: event.payments_events_types_name,
      date: event.event_date,
      content,
      leftIcon
    };
  });

  return (
    <div className={styles.modalDetailPaymentEvents}>
      <h3 className={styles.modalDetailPaymentEvents__title}>Trazabilidad</h3>
      <TimelineEvents events={items} />
      <InvoiceDownloadModal
        isModalOpen={isModalFileDetailOpen}
        handleCloseModal={setIsModalFileDetailOpen}
        title="Imagen"
        url={urlStep}
      />
    </div>
  );
};

export default ModalDetailPaymentEvents;
