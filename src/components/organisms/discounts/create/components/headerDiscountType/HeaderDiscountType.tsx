"use client";
import styles from "./HeaderDiscountType.module.scss";
import { Button, Flex, Typography } from "antd";
import discountCategories from "../../../constants/discountTypes";
import Link from "next/link";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";

const { Title } = Typography;

type Props = {
  selectedType: number;
  // eslint-disable-next-line no-unused-vars
  handleClick: (type: number) => void;
  discountId?: number;
};

export default function HeaderDiscountType({ selectedType, handleClick, discountId }: Props) {
  const canEdit = discountId === undefined;
  const handleEdit = canEdit ? handleClick : () => {};

  return (
    <Flex className={styles.HeaderContainer} justify="space-between" vertical gap={20}>
      <Flex gap={20} justify="space-between" wrap="wrap">
        <Title style={{ width: "fit-content" }} level={4}>
          Selecciona el tipo de descuento
        </Title>
        <Link href="/descuentos" passHref legacyBehavior>
          <PrincipalButton className="PrincipalButton">Volver a la lista</PrincipalButton>
        </Link>
      </Flex>
      <Flex className={styles.buttonContainer} justify="space-around" wrap="wrap" gap={20}>
        {Object.keys(discountCategories).map((key) => (
          <Button
            key={`button-for-${key}`}
            className={`${styles.buttonIcon} ${selectedType === discountCategories[key].id ? styles.active : ""}`}
            icon={discountCategories[key].Icon()}
            onClick={() => handleEdit(discountCategories[key].id)}
            disabled={!canEdit && discountCategories[key].id !== selectedType}
          >
            {discountCategories[key].name}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}
