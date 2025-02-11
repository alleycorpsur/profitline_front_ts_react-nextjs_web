import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { WarningDiamond, X } from "@phosphor-icons/react";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import InputRadioRightSide from "@/components/ui/input-radio-right-side";

import styles from "./create-order-discounts-modal.module.scss";
import { getDiscounts } from "@/services/commerce/commerce";
import { IDiscountPackageAvailable } from "@/types/commerce/ICommerce";
import { OrderViewContext } from "../../containers/create-order/create-order";
import { useAppStore } from "@/lib/store/store";
export interface CreateOrderDiscountsModalProps {
  setOpenDiscountsModal: Dispatch<SetStateAction<boolean>>;
}

const CreateOrderDiscountsModal: FC<CreateOrderDiscountsModalProps> = ({
  setOpenDiscountsModal
}) => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [radioValue, setRadioValue] = useState<IDiscountPackageAvailable>();
  const [discounts, setDiscounts] = useState<IDiscountPackageAvailable[]>([]);
  const { client, discountId, setDiscountId } = useContext(OrderViewContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      const response = await getDiscounts(projectId, client.id);
      if (response.data) {
        setDiscounts(response.data);
      }
      setLoading(false);
    };
    fetchDiscounts();

    if (discountId) {
      setRadioValue(discountId);
    }
  }, [projectId, client]);

  const handleApplyDiscounts = () => {
    setDiscountId(radioValue);
    setOpenDiscountsModal(false);
  };

  const handleRadioClick = (value: IDiscountPackageAvailable) => {
    setRadioValue((prevValue) =>
      !prevValue
        ? value
        : prevValue.id === value.id && prevValue.idAnnualDiscount === value.idAnnualDiscount
          ? undefined
          : value
    );
  };

  const styleRadio = {
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    padding: "1rem"
  };

  return (
    <div className={styles.discountsModal}>
      <div className={styles.header}>
        <h3>Descuentos</h3>
        <button onClick={() => setOpenDiscountsModal(false)} className={styles.buttonClose}>
          <X size={26} />
        </button>
      </div>

      <div className={styles.subTitle}>
        <WarningDiamond size={20} />
        <p>Recuerda que algunos descuentos no son acumulables</p>
      </div>
      {loading ? (
        <Spin size="small" />
      ) : (
        <div className={styles.radioGroup}>
          {discounts.map((discountPackage, index) => (
            <InputRadioRightSide
              key={`discount-${index}`}
              value={discountPackage}
              customStyles={styleRadio}
              onClick={() => handleRadioClick(discountPackage)}
              checked={
                radioValue &&
                radioValue.id === discountPackage.id &&
                radioValue.idAnnualDiscount === discountPackage.idAnnualDiscount
              }
            >
              <div className={styles.radioGroup__label}>
                <p>{discountPackage.name}</p>
              </div>
            </InputRadioRightSide>
          ))}
        </div>
      )}

      <PrincipalButton disabled={false} onClick={handleApplyDiscounts}>
        Aplicar
      </PrincipalButton>
    </div>
  );
};

export default CreateOrderDiscountsModal;
