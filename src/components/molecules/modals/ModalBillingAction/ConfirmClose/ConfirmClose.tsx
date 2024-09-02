import { Flex, message, Skeleton } from "antd";
import FooterButtons from "../FooterButtons/FooterButtons";
import { ViewEnum } from "../ModalBillingAction";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./ConfirmClose.module.scss";
import { getAceptBilling } from "@/services/billings/billings";
import { MessageInstance } from "antd/es/message/interface";
interface ConfirmClose {
  setSelectedView: (value: SetStateAction<ViewEnum>) => void;
  onClose: () => void;
  idTR: number;
  totalValue: number;
  messageApi: MessageInstance;
}

const ConfirmClose = ({ setSelectedView, onClose, totalValue, idTR, messageApi }: ConfirmClose) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const aceptBilling = async () => {
    try {
      setIsLoading(true);
      const response = await getAceptBilling(idTR);
      console.log("aceptBilling", response);
      if (response) {
        messageApi?.open({
          type: "success",
          content: "Se aceptó el cierre correctamente",
          duration: 3
        });
      }
    } catch (error) {
      messageApi?.open({
        type: "error",
        content: "Hubo un problema, vuelve a intentarlo",
        duration: 3
      });
    } finally {
      onClose();
      setIsLoading(false);
    }
  };
  const handleConfirm = () => {
    aceptBilling();
  };

  return (
    <Skeleton active loading={isLoading}>
      <Flex vertical gap={24}>
        <p className={styles.subtitle}>
          Estas confirmando la finalización de la <b>{`TR #${idTR}`}</b> por valor de{" "}
          <b>{`$${totalValue}`}</b>
        </p>
        <FooterButtons titleConfirm="Confirmar" onClose={onClose} handleOk={handleConfirm} />
      </Flex>
    </Skeleton>
  );
};
export default ConfirmClose;