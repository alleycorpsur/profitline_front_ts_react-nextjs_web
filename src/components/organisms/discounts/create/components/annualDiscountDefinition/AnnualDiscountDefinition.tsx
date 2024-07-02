import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import style from "./AnnualDiscountDefinition.module.scss";
import { Button, DatePicker, Flex, Select, Typography } from "antd";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import {
  FileObject,
  UploadDocumentButton
} from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import AnnualFeatures from "./annualFeatures/AnnualFeatures";
import { getOptionsByType } from "../../../constants/discountTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DiscountSchema } from "../../resolvers/generalResolver";
import { getAllByProject } from "@/services/clients/clients";
import { useAppStore } from "@/lib/store/store";
import { Pencil } from "phosphor-react";
import Link from "next/link";

const { Title, Text } = Typography;

type Props = {
  selectedType: number;
  form: UseFormReturn<DiscountSchema, any, undefined>;
  setFiles: Dispatch<SetStateAction<FileObject[]>>;
  statusForm: "create" | "edit" | "review";
  // eslint-disable-next-line no-unused-vars
  handleChangeStatusForm: (status: "create" | "edit" | "review") => void;
};

export default function AnnualDiscountDefinition({
  selectedType,
  form,
  setFiles,
  statusForm,
  handleChangeStatusForm
}: Props) {
  const { ID: projectId } = useAppStore((project) => project.selectProject);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getAllByProject({ idProject: projectId.toString() });
      setOptions(res?.map((client) => ({ label: client.client_name, value: client.nit })));
    } catch (error) {
      console.warn("error fetching clients: ", error);
    } finally {
      setLoading(false);
    }
  };

  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const options = getOptionsByType(selectedType);
    setValue("discount_type", options[0].value);
    return () => {
      setValue("discount_type", undefined);
    };
  }, [selectedType]);

  const {
    setValue,
    control,
    getValues,
    formState: { errors }
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "annual_ranges"
  });

  return (
    <Flex className={style.HeaderContainer} vertical gap={20}>
      <Flex gap={20} justify="space-between">
        <Title level={4}>Selecciona cliente</Title>
        {statusForm !== "create" && (
          <Button
            className={style.buttonEdit}
            htmlType="button"
            onClick={(e) => {
              e.preventDefault();
              handleChangeStatusForm(statusForm === "review" ? "edit" : "review");
            }}
          >
            {statusForm === "review" ? "Editar Descuento" : "Cancelar Edicion"}
            <Pencil size={"1.2rem"} />
          </Button>
        )}
      </Flex>
      <Flex vertical>
        <Controller
          name="client"
          control={control}
          render={({ field }) => {
            return (
              <>
                <Select
                  placeholder="Selecciona cliente"
                  placement="bottomLeft"
                  labelRender={(e) => e.label}
                  className={`${style.selectInput} translate`}
                  loading={loading}
                  variant="borderless"
                  optionLabelProp="label"
                  options={options}
                  {...field}
                ></Select>
                <Text type="danger" hidden={!errors.client}>
                  {errors?.client?.message}
                </Text>
              </>
            );
          }}
        />
      </Flex>
      <Title level={4}>{statusForm === "create" ? "Adjuntar contrato" : "Ver contrato"}</Title>
      <Flex gap={20}>
        {statusForm === "create" ? (
          <UploadDocumentButton title="Contrato" isMandatory={true} setFiles={setFiles} />
        ) : (
          <Link href={getValues("contract_archive") || ""} target="_blank">
            {getValues("contract_archive")?.split("-").pop()}
          </Link>
        )}
      </Flex>
      <Title level={4}>Descripción</Title>
      <Flex gap={20}>
        <InputForm
          control={control}
          error={errors.name}
          nameInput="name"
          titleInput="Nombre"
          className={style.input}
        ></InputForm>
        <InputForm
          control={control}
          error={errors.description}
          nameInput="description"
          titleInput="Descripción"
          className={style.inputDesc}
        ></InputForm>
      </Flex>
      <Title level={4}>Fechas</Title>
      <Flex gap={20}>
        <Flex vertical>
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <Text type="secondary">Inicio</Text>
                  <DatePicker
                    className={style.inputDatePicker}
                    placeholder="Inicio"
                    type="secondary"
                    {...field}
                  ></DatePicker>
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
            render={({ field }) => {
              return (
                <>
                  <Text type="secondary">Fin</Text>
                  <DatePicker
                    className={style.inputDatePicker}
                    placeholder="Fin"
                    type="secondary"
                    {...field}
                  ></DatePicker>
                  <Text type="danger" style={{ textWrap: "wrap" }} hidden={!errors.end_date}>
                    {errors?.end_date?.message}
                  </Text>
                </>
              );
            }}
          />
        </Flex>
      </Flex>
      <hr></hr>
      <Title level={4}>Características del descuento</Title>
      <Title level={5}>Productos a aplicar</Title>
      <AnnualFeatures
        form={form}
        fields={fields}
        append={append}
        remove={remove}
        statusForm={statusForm}
      ></AnnualFeatures>
      {<Text type="danger" hidden={!errors.annual_ranges?.root}>{errors?.annual_ranges?.root?.message}</Text>}
    </Flex>
  );
}
