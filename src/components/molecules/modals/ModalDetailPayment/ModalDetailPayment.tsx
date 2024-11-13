import { FC, useEffect, useState } from "react";
import { Button, Flex, Spin } from "antd";
import { CaretDoubleRight, DotsThree, Receipt } from "phosphor-react";

import { formatMoney } from "@/utils/utils";
import { getPaymentDetail } from "@/services/banksPayments/banksPayments";

import ModalDetailPaymentEvents from "./components/ModalDetailPaymentEvents/ModalDetailPaymentEvents";

import { IPaymentDetail, ISingleBank } from "@/types/banks/IBanks";

import styles from "./ModalDetailPayment.module.scss";

interface ModalDetailPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number;
  // eslint-disable-next-line no-unused-vars
  handleActionInDetail?: (selectedPayment: ISingleBank) => void;
  // eslint-disable-next-line no-unused-vars
  handleOpenPaymentDetail?: (paymentId: number) => void;
}

const ModalDetailPayment: FC<ModalDetailPaymentProps> = ({
  isOpen,
  onClose,
  paymentId,
  handleActionInDetail,
  handleOpenPaymentDetail
}) => {
  const [paymentData, setPaymentData] = useState<IPaymentDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      setLoading(true);
      // Fetch payment data
      try {
        const res = await getPaymentDetail(paymentId);
        setPaymentData(res[0]);
      } catch (error) {
        console.error("Error al obtener el detalle del pago:", error);
      }
      setLoading(false);
    };
    fetchPaymentData();
  }, [paymentId]);

  return (
    <aside className={`${styles.wrapper} ${isOpen ? styles.show : styles.hide}`}>
      <div>
        <div className={styles.modalTopSide}>
          <button type="button" className={styles.back} onClick={onClose}>
            <CaretDoubleRight />
          </button>
        </div>
        {loading ? (
          <Flex align="center">
            <Spin style={{ margin: "50px auto" }} />
          </Flex>
        ) : (
          <>
            <div className={styles.header}>
              <h4 className={styles.numberInvoice}>ID pago {paymentData?.id}</h4>
              <Flex gap="1rem">
                <Flex align="flex-start" className={styles.viewInvoice}>
                  <Receipt size={20} />
                  Ver tirilla
                </Flex>
                <Button
                  className={styles.button__actions}
                  size="large"
                  icon={<DotsThree size="1.5rem" />}
                  onClick={() =>
                    handleActionInDetail && handleActionInDetail(paymentData as ISingleBank)
                  }
                >
                  Generar acción
                </Button>
              </Flex>
            </div>

            <div className={styles.idOrder}>
              <p>{paymentData?.account_description}</p>
              <p>{paymentData?.CLIENT_NAME}</p>
              <Flex gap={"8px"}>
                <p className={styles.id}>723846523X</p>
                <p className={styles.bank}>{paymentData?.bank_description}</p>
              </Flex>
            </div>

            <ModalDetailPaymentEvents
              paymentEvents={paymentData?.events}
              handleOpenPaymentDetail={handleOpenPaymentDetail}
            />
          </>
        )}
      </div>
      <div className={styles.footer}>
        <h4 className={styles.resume}>Resumen</h4>
        <div className={styles.bodyContent}>
          <div className={styles.initialValue}>
            <p className={styles.value}>Valor inicial</p>
            <p className={styles.result}>{formatMoney(paymentData?.initial_value)}</p>
          </div>
          <div className={styles.initialValue}>
            <p className={styles.value}>Monto aplicado</p>
            <p className={styles.result}>{formatMoney(paymentData?.ammount_applied)}</p>
          </div>
          <hr />
          <div className={styles.total}>
            <p className={styles.value}>Disponible</p>
            <p className={styles.result}>{formatMoney(paymentData?.current_value)}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ModalDetailPayment;
