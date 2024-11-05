import { FC } from "react";
import { ArrowLineDown } from "phosphor-react";

import TimelineEvents from "@/components/ui/timeline-events";

import { IEvent } from "@/types/banks/IBanks";

import styles from "./modalDetailPaymentEvents.module.scss";

interface ModalDetailPaymentProps {
  paymentEvents: IEvent[] | undefined;
}

const ModalDetailPaymentEvents: FC<ModalDetailPaymentProps> = ({ paymentEvents }) => {
  const items = paymentEvents?.map((event, index) => {
    console.log("event ", index, event);
    const leftIcon =
      event.payments_events_types_name === "Identificacion" ||
      event.payments_events_types_name === "Aplicación" ? (
        <ArrowLineDown size={14} />
      ) : null;

    const content = (
      <div className={styles.modalDetailPaymentEvents__eventContent}>
        {event.USER_NAME && <p className={styles.regularEntry}>Responsable: {event.USER_NAME}</p>}

        <p className={styles.regularEntry}>Cliente: XXXX</p>

        <p className={styles.regularEntry}>Cliente previo: XXXX</p>
        <p className={styles.regularEntry}>Nuevo cliente: XXXX</p>

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
    </div>
  );
};

export default ModalDetailPaymentEvents;
