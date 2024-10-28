"use client";
import { Button, DatePicker, Flex, Switch, Table, Typography } from "antd";
import Link from "next/link";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import useCreateDiscountPackage from "./hooks/useCreateDiscountPackage";
import styles from "./CreateDiscountPackageView.module.scss";
import { Pencil, Plus } from "phosphor-react";
import { Controller } from "react-hook-form";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { discountsFormColumns } from "../../constants/column";
import { DividerCustom } from "@/components/atoms/DividerCustom/DividerCustom";
import AddDiscountModal from "@/components/molecules/modals/AddDiscountModal/AddDiscountModal";
import { useState } from "react";

type Props = {
  params?: { id: string };
};
export type TypeDiscount = "principal" | "additional";
const { Title, Text } = Typography;

export function CreatePDiscountPackageView({ params }: Props) {
  const {
    form,
    handleExecCallback,
    loading,
    statusForm,
    handleChangeStatusForm,
    contextHolder,
    setIsModalOpen,
    isModaltOpen,
    errors,
    control,
    discountFields,
    additionalDiscountFields,
    trigger,
    watch,
    appendDiscount,
    appendAdditionalDiscount,
    removeDiscount,
    removeAdditionalDiscount
  } = useCreateDiscountPackage({ params });

  const discountId = null;

  const [typeDiscount, setTypeDiscount] = useState<TypeDiscount | null>(null);
  return (
    <>
      {contextHolder}
      <Flex className={styles.mainCreateDiscount}>
        <Flex className={styles.HeaderContainer} vertical gap={20}>
          <Flex gap={20} justify="space-between">
            {statusForm !== "create" && (
              <Button
                className={styles.buttonEdit}
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeStatusForm(statusForm === "review" ? "edit" : "review");
                }}
                loading={false}
              >
                {statusForm === "review" ? "Editar Descuento" : "Cancelar Edicion"}
                <Pencil size={"1.2rem"} />
              </Button>
            )}
          </Flex>
          <Title level={4}>Descripción</Title>
          <Flex gap={20}>
            <InputForm
              control={control}
              error={errors.name}
              nameInput="name"
              titleInput="Nombre"
              className={styles.input}
            />
            <InputForm
              control={control}
              error={errors.description}
              nameInput="description"
              titleInput="Descripción"
              className={styles.inputDesc}
            />
          </Flex>
          <Title level={4}>Fechas</Title>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => {
              return (
                <Flex gap={40} align="center">
                  <Switch
                    style={{ width: "fit-content", transform: "scale(2) translateX(25%)" }}
                    size="small"
                    {...field}
                  />
                  <Text type="secondary">No tiene fin</Text>
                </Flex>
              );
            }}
          />
          <Flex gap={20}>
            <Flex vertical>
              <Controller
                name="start_date"
                control={control}
                render={({ field: { value, ...field } }) => {
                  return (
                    <>
                      <Text type="secondary">Inicio</Text>
                      <DatePicker
                        className={styles.inputDatePicker}
                        placeholder="Inicio"
                        type="secondary"
                        format="YYYY-MM-DD"
                        value={value}
                        {...field}
                      />
                      <Text type="danger" style={{ textWrap: "wrap" }} hidden={!errors.start_date}>
                        {errors?.start_date?.message}
                      </Text>
                    </>
                  );
                }}
              />
            </Flex>
            <Flex vertical>
              <Controller
                name="end_date"
                control={control}
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <>
                      <Text type="secondary">Fin</Text>
                      <DatePicker
                        disabled={watch("is_active")}
                        className={styles.inputDatePicker}
                        placeholder="Fin"
                        type="secondary"
                        onChange={(e) => {
                          onChange(e);
                          trigger("end_date");
                        }}
                        {...field}
                      ></DatePicker>
                      <Text type="danger" hidden={!errors.end_date}>
                        {errors?.end_date?.message}
                      </Text>
                    </>
                  );
                }}
              />
            </Flex>
          </Flex>
          <DividerCustom />
          <Flex gap={20} vertical>
            <Flex vertical gap={24}>
              <Title level={4}>Descuento</Title>
              <Table
                dataSource={discountFields}
                columns={discountsFormColumns({ remove: removeDiscount })}
                pagination={false}
              />
              <Flex justify="flex-end">
                <PrincipalButton
                  onClick={() => {
                    setTypeDiscount("principal");
                    setIsModalOpen(true);
                  }}
                  icon={<Plus />}
                  iconPosition="end"
                >
                  Agregar regla de descuento
                </PrincipalButton>
              </Flex>
            </Flex>
            <Flex vertical gap={24}>
              <Title level={4}>Descuento adicional</Title>
              <Table
                dataSource={additionalDiscountFields}
                columns={discountsFormColumns({ remove: removeAdditionalDiscount })}
                pagination={false}
              />
              <Flex justify="flex-end">
                <PrincipalButton
                  onClick={() => {
                    setTypeDiscount("additional");
                    setIsModalOpen(true);
                  }}
                  icon={<Plus />}
                  iconPosition="end"
                >
                  Agregar regla de descuento
                </PrincipalButton>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={20} justify="space-between">
          <Link href="/descuentos" passHref legacyBehavior>
            <Button
              style={{ height: "100%", backgroundColor: "#d3d3d3" }}
              className={styles.buttonEdit}
            >
              Volver a la lista
            </Button>
          </Link>
          {statusForm !== "review" && (
            <PrincipalButton
              className={styles.button}
              onClick={handleExecCallback}
              loading={loading}
            >
              {discountId ? "Guardar Descuento" : "Crear Descuento"}
            </PrincipalButton>
          )}
        </Flex>
      </Flex>
      <AddDiscountModal
        isModalOpen={isModaltOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTypeDiscount(null);
        }}
        typeDiscount={typeDiscount}
        onConfirm={typeDiscount === "principal" ? appendDiscount : appendAdditionalDiscount}
      />
    </>
  );
}
