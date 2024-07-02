import { Col, Flex, Radio, Row, Typography } from "antd";
import styles from "./FeatByOrder.module.scss";
import { rangesDummy } from "./dataDummy";
import { useEffect, useMemo } from "react";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { Plus } from "phosphor-react";
import RangesRow from "../../rangesRow/RangesRow";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import ProductList from "../../productList/ProductList";
import { DiscountSchema } from "../../../../resolvers/generalResolver";
import {
  discountTypesByOrder,
  typesWithMinByOrder
} from "@/components/organisms/discounts/constants/discountTypes";
import useDiscountFeats from "../hooks/useDiscountFeats";

const { Title, Text } = Typography;

type FeatByOrderProps = {
  discountType: number;
  form: UseFormReturn<DiscountSchema, any, undefined>;
  statusForm: "create" | "edit" | "review";
};

export default function FeatByOrder({ discountType, form, statusForm }: FeatByOrderProps) {
  const {
    formState: { errors },
    control,
    setValue,
    watch,
    register
  } = form;
  const { lines, onChange, isLoading } = useDiscountFeats({ setValue });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ranges"
  });

  const handleGetLabels = (discountType: number) => {
    if (discountType === 1) {
      return {
        unitsFrom: "Cantidad mínima",
        unitsTo: "Cantidad máxima"
      };
    } else if (discountType === 2) {
      return {
        unitsFrom: "Monto mínimo",
        unitsTo: "Monto máximo"
      };
    } else if (discountType === 3) {
      return {
        unitsFrom: "Minimo de canales",
        unitsTo: "Mínimo de unidades por canal"
      };
    } else {
      return {
        unitsFrom: "Minimo de SKU's",
        unitsTo: "Mínimo de unidades por canal"
      };
    }
  };

  const principalStyle = useMemo(() => {
    if (typesWithMinByOrder.includes(discountType)) return styles.principalContainer;
    else return "";
  }, [discountType]);

  return (
    <Flex className={principalStyle} vertical gap={20}>
      {typesWithMinByOrder.includes(discountType) && (
        <>
          <Title style={{ marginBottom: 0 }} level={5}>
            Cantidad mínima de orden
          </Title>
          <InputForm
            control={control}
            nameInput="min_order"
            error={errors.min_order}
            placeholder="0"
            className={styles.input}
          />
        </>
      )}
      <ProductList
        lines={lines}
        loading={isLoading}
        form={form}
        statusForm={statusForm}
      ></ProductList>
      <Radio.Group
        onChange={onChange}
        value={watch("computation_type")}
        className={styles.radioGroup}
        disabled={statusForm === "review"}
      >
        <Radio value={1}>Descuento aplicable en porcentaje</Radio>
        <Radio value={2}>Descuento aplicable en valor fijo</Radio>
      </Radio.Group>
      <Text type="danger" hidden={!errors?.computation_type}>
        {errors?.computation_type?.message}
      </Text>
      <Flex className={styles.rangesContainer} vertical>
        <Flex className={styles.rangesSubContainer} gap={10} vertical>
          <Row>
            <Col span={8}>{handleGetLabels(watch("discount_type") || 0).unitsFrom}</Col>
            <Col span={8}>{handleGetLabels(watch("discount_type") || 0).unitsTo}</Col>
            <Col span={8}>Descuento a aplicar</Col>
          </Row>
          <hr />
          {fields.map((_, index) => (
            <RangesRow
              errors={errors}
              control={control}
              register={register}
              key={"range - " + index}
              id={index}
              remove={
                index == fields.length - 1 && statusForm !== "review"
                  ? () => remove(index)
                  : undefined
              }
            />
          ))}
          <Text type="danger" hidden={!errors?.ranges}>
            {errors?.ranges?.message}
          </Text>
        </Flex>
        {statusForm !== "review" && (
          <Flex className={styles.rangesContainer} justify="flex-end">
            <PrincipalButton
              onClick={() => append({ id: 0, unitsMin: 0, unitsMax: 0, discount: 0 })}
              className={styles.button}
              icon={<Plus />}
              iconPosition="end"
            >
              Agregar rango
            </PrincipalButton>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
