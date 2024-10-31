import React, { useState, useEffect } from "react";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { Button, DatePicker, Flex, Select, Typography } from "antd";
import { useInfiniteQuery } from "react-query";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import {
  FileObject,
  UploadDocumentButton
} from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import AnnualFeatures from "./annualFeatures/AnnualFeatures";
import { getOptionsByType } from "../../../../constants/discountTypes";
import { DiscountSchema } from "../../resolvers/generalResolver";
import { useAppStore } from "@/lib/store/store";
import { Pencil } from "phosphor-react";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";
import style from "./AnnualDiscountDefinition.module.scss";

import { fetcher } from "@/utils/api/api";
import { useDebounce } from "@/hooks/useDeabouce";

const { Title, Text } = Typography;

type Props = {
  selectedType: number;
  form: UseFormReturn<DiscountSchema, any, undefined>;
  setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
  statusForm: "create" | "edit" | "review";
  handleChangeStatusForm: (status: "create" | "edit" | "review") => void;
  loadingMain: boolean;
  handleUpdateContract: () => void;
};

export default function AnnualDiscountDefinition({
  selectedType,
  form,
  setFiles,
  statusForm,
  handleChangeStatusForm,
  loadingMain,
  handleUpdateContract
}: Props) {
  const { ID: projectId } = useAppStore((project) => project.selectedProject);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchClients = async ({ pageParam = 1 }) => {
    const limit = 50;
    const searchQueryParam = debouncedSearchQuery
      ? `&searchQuery=${encodeURIComponent(debouncedSearchQuery.toLowerCase().trim())}`
      : "";

    const pathKey = `/portfolio/client/project/${projectId}?page=${pageParam}&limit=${limit}${searchQueryParam}`;

    return fetcher(pathKey);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ["clients", debouncedSearchQuery, projectId],
    fetchClients,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.message === "no rows" || lastPage?.data?.clientsPortfolio?.length < 50)
          return undefined;
        return pages.length + 1;
      }
    }
  );

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

  useEffect(() => {
    const options = getOptionsByType(selectedType);
    setValue("discount_type", options[0].value);
    return () => {
      setValue("discount_type", undefined);
    };
  }, [selectedType, setValue]);

  const options =
    data?.pages.flatMap(
      (page) =>
        page.data?.clientsPortfolio?.map((client: { client_name: string; client_id: string }) => ({
          label: client.client_name,
          value: client.client_id
        })) || []
    ) || [];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { currentTarget } = event;
    if (currentTarget.scrollTop + currentTarget.clientHeight >= currentTarget.scrollHeight - 20) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };
  return (
    <Flex className={style.HeaderContainer} vertical gap={20}>
      <Flex gap={20} justify="space-between">
        <Title level={4}>Selecciona cliente</Title>
        {statusForm !== "create" && (
          <Button
            className={style.buttonEdit}
            htmlType="button"
            loading={loadingMain}
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
          render={({ field }) => (
            <>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Selecciona cliente"
                className={`${style.selectInput} translate`}
                loading={isFetchingNextPage || isLoading}
                variant="borderless"
                optionLabelProp="label"
                options={options}
                disabled={statusForm !== "create"}
                onSearch={setSearchQuery}
                filterOption={false}
                onPopupScroll={handleScroll}
                {...field}
              >
                {isFetchingNextPage && <Select.Option disabled>Cargando más...</Select.Option>}
              </Select>
              <Text type="danger" hidden={!errors.client}>
                {errors?.client?.message}
              </Text>
            </>
          )}
        />
      </Flex>
      <Title level={4}>{statusForm === "create" ? "Adjuntar contrato" : "Ver contrato"}</Title>
      <Flex gap={20}>
        <UploadDocumentButton
          title="Contrato"
          isMandatory={true}
          setFiles={setFiles}
          containerClassName={style.uploadDocumentButton}
          draggerClassname={style.dragger}
          disabled={statusForm === "review" || !!getValues("contract_archive")}
        >
          {(statusForm === "review" || !!getValues("contract_archive")) && (
            <UploadDocumentChild
              showTrash={statusForm !== "review"}
              linkFile={getValues("contract_archive") || ""}
              nameFile={getValues("contract_archive")?.split("-").pop() || ""}
              onDelete={handleUpdateContract}
            />
          )}
        </UploadDocumentButton>
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
      {
        <Text type="danger" hidden={!errors.annual_ranges?.root}>
          {errors?.annual_ranges?.root?.message}
        </Text>
      }
    </Flex>
  );
}
