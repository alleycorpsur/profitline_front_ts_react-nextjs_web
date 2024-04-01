import { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
import { Control, Controller, FieldError } from "react-hook-form";

import { getAllRisks } from "@/services/risk/risk";

import "./selectrisk.scss";

interface Props {
  nameInput: string;
  control: Control<any> | undefined;
  errors: FieldError | undefined;
}

export const SelectRisk = ({ nameInput, control, errors }: Props) => {
  const [documentTypes, setDocumentTypes] = useState<{ label: any; value: any }[]>(
    [] as { label: any; value: any }[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGetData, setIsGetData] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isGetData) return;
      setIsLoading(true);
      const response = await getAllRisks();
      console.log(response);

      setDocumentTypes(
        response.data.data.map((risk) => ({
          value: risk.id,
          label: `${risk.id}-${risk.risk_name}`
        }))
      );
      setIsLoading(false);
    })();
  }, [isGetData]);

  return (
    <Flex vertical style={{ width: "24%", marginRight: ".8%" }} justify="center">
      <Typography.Title level={5}>Riesgo</Typography.Title>
      <Controller
        name={nameInput}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            loading={isLoading}
            className={errors ? "selectdocumenttypeError" : "selectdocumenttype"}
            placeholder="Seleccionar el riesgo"
            options={documentTypes}
            onDropdownVisibleChange={() => setIsGetData(true)}
            {...field}
          />
        )}
      />
      {errors && (
        <Typography.Text className="textError">La ciudad es obligatoria *</Typography.Text>
      )}
    </Flex>
  );
};
