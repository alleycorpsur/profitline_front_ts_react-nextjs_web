import { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
import { Control, Controller, FieldError } from "react-hook-form";

import { getAllRadicationTypes } from "@/services/radicationTypes/radicationTypes";

import "./selectradicationtype.scss";

interface Props {
  nameInput: string;
  control: Control<any> | undefined;
  errors: FieldError | undefined;
}

export const SelectRadicationType = ({ nameInput, control, errors }: Props) => {
  const [documentTypes, setDocumentTypes] = useState<{ label: any; value: any }[]>(
    [] as { label: any; value: any }[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGetData, setIsGetData] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isGetData) return;
      setIsLoading(true);
      const response = await getAllRadicationTypes();

      setDocumentTypes(
        response.data.data.map((radication) => ({
          value: radication.id,
          label: `${radication.id}-${radication.radication_name}`
        }))
      );
      setIsLoading(false);
    })();
  }, [isGetData]);

  return (
    <Flex vertical style={{ width: "24%", marginRight: ".8%" }} justify="center">
      <Typography.Title level={5}>Tipo de Radicacion</Typography.Title>
      <Controller
        name={nameInput}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            loading={isLoading}
            className={errors ? "selectdocumenttypeError" : "selectdocumenttype"}
            placeholder="Seleccionar el tipo de radicacion"
            options={documentTypes}
            onDropdownVisibleChange={() => setIsGetData(true)}
            {...field}
          />
        )}
      />
      {errors && (
        <Typography.Text className="textError">
          El tipo de radicacion es obligatoria *
        </Typography.Text>
      )}
    </Flex>
  );
};
