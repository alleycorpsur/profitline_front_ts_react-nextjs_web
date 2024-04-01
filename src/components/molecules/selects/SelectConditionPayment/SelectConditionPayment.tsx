import { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
import { Control, Controller, FieldError } from "react-hook-form";

import { getAllConditionPayments } from "@/services/conditionPayments/conditionPayments";

import "./selectconditionpayment.scss";

interface Props {
  nameInput: string;
  control: Control<any> | undefined;
  errors: FieldError | undefined;
}

export const SelectConditionPayment = ({ nameInput, control, errors }: Props) => {
  const [documentTypes, setDocumentTypes] = useState<{ label: any; value: any }[]>(
    [] as { label: any; value: any }[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGetData, setIsGetData] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isGetData) return;
      setIsLoading(true);
      const response = await getAllConditionPayments();

      setDocumentTypes(
        response.data.data.map((condition) => ({
          value: condition.id,
          label: `${condition.condition_day}`
        }))
      );
      setIsLoading(false);
    })();
  }, [isGetData]);

  return (
    <Flex vertical style={{ width: "24%", marginRight: ".8%" }} justify="center">
      <Typography.Title level={5}>Condición de pago</Typography.Title>
      <Controller
        name={nameInput}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            loading={isLoading}
            className={errors ? "selectdocumenttypeError" : "selectdocumenttype"}
            placeholder="Seleccionar la condicion de pago"
            options={documentTypes}
            onDropdownVisibleChange={() => setIsGetData(true)}
            {...field}
          />
        )}
      />
      {errors && (
        <Typography.Text className="textError">
          La condicion de pago es obligatoria *
        </Typography.Text>
      )}
    </Flex>
  );
};
