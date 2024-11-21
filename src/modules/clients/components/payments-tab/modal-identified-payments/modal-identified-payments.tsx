import { Dispatch, FC, SetStateAction, useState } from "react";

import { CaretLeft } from "phosphor-react";

import { useMessageApi } from "@/context/MessageContext";

import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { IFormIdentifyPaymentModal } from "../modal-identify-payment-action/modal-identify-payment-action";
import CheckboxColoredValues from "@/components/ui/checkbox-colored-values/checkbox-colored-values";

import styles from "./modal-identified-payments.module.scss";
import { formatMoney } from "@/utils/utils";
import { Controller, useForm } from "react-hook-form";

interface ModalIdentifiedPaymentProps {
  // eslint-disable-next-line no-unused-vars
  setViewInfo: Dispatch<
    SetStateAction<{
      current: "form" | "identified" | "not_identified";
      paymentInfo: IFormIdentifyPaymentModal | undefined;
    }>
  >;
}

const ModalIdentifiedPayment: FC<ModalIdentifiedPaymentProps> = ({ setViewInfo }) => {
  const { showMessage } = useMessageApi();
  const { control, handleSubmit, watch } = useForm<{ payments: Record<string, boolean> }>({
    defaultValues: {
      payments: mockPayments.reduce(
        (acc, payment) => {
          acc[payment.id] = false; // Initialize all payments as unchecked
          return acc;
        },
        {} as Record<number, boolean>
      )
    }
  });

  const selectedPayments = watch("payments");

  const handleIdentifyPayments = () => {
    try {
      const identifiedPayments = mockPayments.filter((payment) => selectedPayments[payment.id]);
      console.info("Pagos identificados:", identifiedPayments);

      showMessage("success", "Pagos identificados enviados correctamente!");
    } catch (error) {
      showMessage("error", "Ocurrió un error al identificar los pagos");
    }
  };

  const handleCancel = () => {
    setViewInfo((prev) => ({ ...prev, current: "form" }));
  };

  return (
    <div className={styles.content}>
      <button className={styles.content__header} onClick={handleCancel}>
        <CaretLeft size={"1.25rem"} />
        <h4>Pagos identificados</h4>
      </button>
      <p className={styles.content__description}>Selecciona el pago o pagos que quieres aplicar</p>

      <div className={styles.content__payments}>
        {mockPayments.map((payment) => (
          <Controller
            key={payment.id}
            name={`payments.${payment.id}`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <CheckboxColoredValues
                onChangeCheckbox={(e) => onChange(e.target.checked)} // Sync with react-hook-form
                checked={value} // Controlled state
                content={
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentContent__left}>
                      <h3 className={styles.paymentContent__name}>Pago {payment.id}</h3>
                      <p className={styles.paymentContent__date}>Fecha: {payment.date}</p>
                      <p className={styles.paymentContent__client}>{payment.client}</p>
                    </div>
                    <h2 className={styles.paymentContent__amount}>{formatMoney(payment.amount)}</h2>
                  </div>
                }
              />
            )}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <SecondaryButton onClick={handleCancel}>Cancelar</SecondaryButton>
        <PrincipalButton
          onClick={handleSubmit(handleIdentifyPayments)}
          disabled={!Object.values(selectedPayments).some((isSelected) => isSelected)}
        >
          Identificar
        </PrincipalButton>
      </div>
    </div>
  );
};

export default ModalIdentifiedPayment;

const mockPayments = [
  {
    id: 1,
    date: "10/03/2024",
    client: "Consignación Cooperativa Nacional de Medicamentos",
    amount: 1000000
  },
  {
    id: 2,
    date: "10/03/2024",
    client: "Consignación Cooperativa Nacional de Medicamentos",
    amount: 2000000
  },
  {
    id: 3,
    date: "10/03/2024",
    client: "Consignación Cooperativa Nacional de Medicamentos",
    amount: 3000000
  },
  {
    id: 4,
    date: "10/03/2024",
    client: "Consignación Cooperativa Nacional de Medicamentos",
    amount: 4000000
  }
];
