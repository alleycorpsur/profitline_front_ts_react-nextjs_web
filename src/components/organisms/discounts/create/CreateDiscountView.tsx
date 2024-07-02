"use client";
import styles from "./CreateDiscountView.module.scss";
import { Flex } from "antd";
import HeaderDiscountType from "./components/headerDiscountType/HeaderDiscountType";
import DefinitionDiscounts from "./components/definitionsDiscount/DefinitionDiscounts";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import useCreateDiscountView from "./hooks/useCreateDiscountView";
import AnnualDiscountDefinition from "./components/annualDiscountDefinition/AnnualDiscountDefinition";
import discountCategories from "../constants/discountTypes";

const commonDiscount = [discountCategories.byOrder.id, discountCategories.byClient.id];
const annualDiscount = [discountCategories.annual.id];

type Props = {
  params?: { id: string };
};

export function CreateDiscountView({ params }: Props) {
  const {
    discountId,
    selectedType,
    handleClick,
    form,
    handleExecCallback,
    loading,
    statusForm,
    setFiles,
    handleChangeStatusForm,
    contextHolder
  } = useCreateDiscountView({ params });

  return (
    <>
      {contextHolder}
      <Flex className={styles.mainCreateDiscount}>
        <HeaderDiscountType
          selectedType={selectedType}
          handleClick={handleClick}
          discountId={discountId}
        />
        {commonDiscount.includes(selectedType) && (
          <DefinitionDiscounts
            form={form}
            selectedType={selectedType}
            discountId={discountId}
            statusForm={statusForm}
            handleChangeStatusForm={handleChangeStatusForm}
          />
        )}
        {annualDiscount.includes(selectedType) && (
          <AnnualDiscountDefinition
            form={form}
            selectedType={selectedType}
            setFiles={setFiles}
            statusForm={statusForm}
            handleChangeStatusForm={handleChangeStatusForm}
          />
        )}
        <Flex gap={20} justify="end">
          <PrincipalButton
            className={styles.button}
            onClick={handleExecCallback}
            loading={loading}
            disabled={statusForm === "review"}
          >
            {discountId ? "Editar Descuento" : "Crear Descuento"}
          </PrincipalButton>
        </Flex>
      </Flex>
    </>
  );
}
