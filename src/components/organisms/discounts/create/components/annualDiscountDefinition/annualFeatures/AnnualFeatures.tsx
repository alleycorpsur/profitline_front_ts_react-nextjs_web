import style from "./AnnualFeatures.module.scss";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { Button, Col, Flex, Row, Select, Typography } from "antd";
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn
} from "react-hook-form";
import { Plus, Trash } from "phosphor-react";
import { DiscountSchema } from "../../../resolvers/generalResolver";
import useAnnualFeatures from "./hooks/useAnnualFeatures";

const { Text } = Typography;

type AnnualFeaturesProps = {
  form: UseFormReturn<DiscountSchema, any, undefined>;
  fields: FieldArrayWithId<DiscountSchema, "annual_ranges", "id">[];
  append: UseFieldArrayAppend<DiscountSchema, "annual_ranges">;
  remove: UseFieldArrayRemove;
  statusForm: "create" | "edit" | "review";
};

export default function AnnualFeatures({
  form,
  fields,
  append,
  remove,
  statusForm
}: AnnualFeaturesProps) {
  const {
    control,
    register,
    watch,
    formState: { errors }
  } = form;

  const { findContract, matchRanges, options, isLoadingOption } = useAnnualFeatures({ form });

  return (
    <Flex className={style.container} vertical gap={10}>
      {fields.map((field, index) => (
        <Flex key={`row-${index}`} vertical gap={10}>
          <Row>
            <Col span={5}>
              <span className={style.columnHeader}>Línea</span>
            </Col>
            <Col span={5} offset={1}>
              <span className={style.columnHeader}>Unidades</span>
            </Col>
            <Col span={7} offset={1}>
              <span className={style.columnHeader}>Rango de descuento</span>
            </Col>
            <Col span={4} offset={1}>
              <span className={style.columnHeader}>Descuento</span>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <Controller
                control={control}
                {...register(`annual_ranges.${index}.idLine`)}
                render={({ field }) => {
                  return (
                    <>
                      <Select
                        variant="borderless"
                        className={`${style.selectInput}`}
                        loading={isLoadingOption}
                        options={options}
                        {...field}
                      ></Select>
                    </>
                  );
                }}
              />
            </Col>
            <Col span={5} offset={1}>
              <InputForm
                hiddenTitle={true}
                control={control}
                error={undefined}
                changeInterceptor={matchRanges}
                nameInput={`annual_ranges.${index}.units`}
                className={style.input}
              ></InputForm>
            </Col>
            <Col span={7} offset={1} className={style.discountFeatures}>
              <span>{findContract(watch(`annual_ranges.${index}.idContract`)).range}</span>
            </Col>
            <Col span={3} offset={1} className={style.discountFeatures}>
              <span>{findContract(watch(`annual_ranges.${index}.idContract`)).discount}</span>
            </Col>
            <Col span={1} className={style.discountFeatures}>
              {statusForm !== "review" && (
                <Button type="text" onClick={() => remove(index)}>
                  <Trash size={20} />
                </Button>
              )}
            </Col>
          </Row>
          {/* Errors Row */}
          <Row>
            <Col span={5}>
              <Text type="danger" hidden={!errors?.annual_ranges?.[index]?.idLine}>
                {errors?.annual_ranges?.[index]?.idLine?.message}
              </Text>
            </Col>
            <Col span={5} offset={1}>
              <Text type="danger" hidden={!errors?.annual_ranges?.[index]?.units}>
                {errors?.annual_ranges?.[index]?.units?.message}
              </Text>
            </Col>
            <Col span={7} offset={1}>
              <Text type="danger" hidden={!errors?.annual_ranges?.[index]?.idContract}>
                {errors?.annual_ranges?.[index]?.idContract?.message}
              </Text>
            </Col>
            <Col span={4} offset={1}></Col>
          </Row>
          <hr />
        </Flex>
      ))}
      {statusForm !== "review" && (
        <Flex justify="end">
          <PrincipalButton
            onClick={() => append({ id: 0, idLine: undefined, units: 0, idContract: undefined })}
            className={style.button}
            icon={<Plus />}
            iconPosition="end"
          >
            Agregar descuento
          </PrincipalButton>
        </Flex>
      )}
    </Flex>
  );
}
