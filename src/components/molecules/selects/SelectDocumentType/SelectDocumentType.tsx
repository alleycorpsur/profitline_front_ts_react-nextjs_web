import { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
import { Control, Controller, FieldError } from "react-hook-form";

import { ClientType } from "../../tabs/Projects/ClientProjectForm/ClientProjectForm";
import { getAllDocumentTypes } from "@/services/documentTypes/documentTypes";

import "./selectdocumenttype.scss";

interface Props {
  nameInput: string;
  control: Control<ClientType | any> | undefined;
  errors: FieldError | undefined;
}

export const SelectDocumentType = ({ nameInput, control, errors }: Props) => {
  const [documentTypes, setDocumentTypes] = useState<{ label: any; value: any }[]>(
    [] as { label: any; value: any }[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGetData, setIsGetData] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isGetData) return;
      setIsLoading(true);
      const response = await getAllDocumentTypes();
      setDocumentTypes(
        response.data.data.map((document) => ({
          value: document.id,
          label: document.document_name
        }))
      );
      setIsLoading(false);
    })();
  }, [isGetData]);

  return (
    <Flex vertical style={{ width: "24%", marginRight: ".8%" }} justify="center">
      <Typography.Title level={5}>Tipo de documento</Typography.Title>
      <Controller
        name={nameInput}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            loading={isLoading}
            className={errors ? "selectdocumenttypeError" : "selectdocumenttype"}
            placeholder="Seleccionar el tipo de documento"
            options={documentTypes}
            onDropdownVisibleChange={() => setIsGetData(true)}
            {...field}
          />
        )}
      />
      {errors && <Typography.Text className="textError">Tipo de Documento *</Typography.Text>}
    </Flex>
  );
};
