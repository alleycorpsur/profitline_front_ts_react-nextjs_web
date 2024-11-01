import { FC, useEffect, useState } from "react";
import { Button, Flex, Spin, Steps } from "antd";
import { ArrowLineDown, CaretDoubleRight, DotsThree, Receipt } from "phosphor-react";

import { IEvent } from "@/types/banks/IBanks";

import "./modalDetailPaymentEvents.scss";
import TimelineEvents from "@/components/ui/timeline-events";

const { Step } = Steps;

interface ModalDetailPaymentProps {
  paymentEvents: IEvent[] | undefined;
}

const ModalDetailPaymentEvents: FC<ModalDetailPaymentProps> = ({ paymentEvents }) => {
  const icon = (
    <div
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: "yellow"
      }}
    />
  );

  const items = paymentEvents?.map((event, index) => {
    const leftIcon =
      event.payments_events_types_name === "Identificación" || " Aplicación" ? <h2>A</h2> : null;

    const content = (
      <div>
        <p>{event.comments}</p>
        <p>{event.USER_NAME}</p>
      </div>
    );

    return {
      id: event.id,
      title: event.payments_events_types_name,
      content,
      leftIcon
    };
  });

  return (
    <div className="modalDetailPaymentEvents">
      <h3>Trazabilidad</h3>
      <TimelineEvents events={items} />
    </div>
  );
};

export default ModalDetailPaymentEvents;
