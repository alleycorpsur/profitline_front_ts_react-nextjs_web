import { Dispatch, FC, SetStateAction, useState } from "react";
import { Radio } from "antd";
import { CaretLeft } from "phosphor-react";

import { useMessageApi } from "@/context/MessageContext";
import { formatMoney } from "@/utils/utils";

import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { IFormIdentifyPaymentModal } from "../modal-identify-payment-action/modal-identify-payment-action";
import { DividerVerticalModal } from "@/components/atoms/DividerVertical/DividerVerticalModal";

import styles from "./modal-identified-payments.module.scss";

interface ModalIdentifiedPaymentProps {
  setViewInfo: Dispatch<
    SetStateAction<{
      current: "form" | "identified" | "not_identified";
      paymentInfo: IFormIdentifyPaymentModal | undefined;
    }>
  >;
}

const ModalIdentifiedPayment: FC<ModalIdentifiedPaymentProps> = ({ setViewInfo }) => {
  const { showMessage } = useMessageApi();
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  const handleIdentifyPayments = () => {
    try {
      const identifiedPayment = mockPayments.find((payment) => payment.id === selectedPaymentId);
      console.info("Pago identificado:", identifiedPayment);

      showMessage("success", "Pago identificado enviado correctamente!");
    } catch (error) {
      showMessage("error", "Ocurrió un error al identificar el pago");
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
      <p className={styles.content__description}>Selecciona el pago que quieres aplicar</p>

      <Radio.Group
        className={styles.content__payments}
        onChange={(e) => setSelectedPaymentId(e.target.value)}
        value={selectedPaymentId}
      >
        {mockPayments.map((payment) => (
          <Radio key={payment.id} value={payment.id} className={styles.paymentRadio}>
            <div className={styles.paymentContent}>
              <div className={styles.paymentContent__colorLabelContainer}>
                <DividerVerticalModal customStyles={{ width: "6px", margin: "8px 8px 8px 0px" }} />
              </div>
              <div className={styles.paymentContent__content}>
                <div className={styles.paymentContent__content__left}>
                  <h3 className={styles.paymentContent__content__name}>Pago {payment.id}</h3>
                  <p className={styles.paymentContent__content__date}>{payment.date}</p>
                  <p className={styles.paymentContent__content__client}>{payment.client}</p>
                </div>
                <h2 className={styles.paymentContent__content__amount}>
                  {formatMoney(payment.amount)}
                </h2>
              </div>
            </div>
          </Radio>
        ))}
      </Radio.Group>

      <div className={styles.footer}>
        <SecondaryButton onClick={handleCancel}>Cancelar</SecondaryButton>
        <PrincipalButton onClick={handleIdentifyPayments} disabled={selectedPaymentId === null}>
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
