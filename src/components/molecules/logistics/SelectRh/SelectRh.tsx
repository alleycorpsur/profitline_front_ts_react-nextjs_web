import { Select, Typography } from "antd";

import "./SelectRh.scss";

interface Props {
  errors: any;
  field: any;
  selected?: any;
}

export const bloodTypes = {
  data: [
    {
      id: 1,
      value: "A+"
    },
    {
      id: 2,
      value: "A-"
    },
    {
      id: 3,
      value: "B+"
    },
    {
      id: 4,
      value: "B-"
    },
    {
      id: 5,
      value: "O+"
    },
    {
      id: 6,
      value: "O-"
    },
    {
      id: 7,
      value: "AB+"
    },
    {
      id: 8,
      value: "AB-"
    }
  ]
};
export const SelectRh = ({ errors, field, selected }: Props) => {
  const options = bloodTypes?.data.map((option) => {
    return {
      value: option.id,
      label: option.value
    };
  });

  return (
    <>
      <Select
        placeholder="Selecciona Tipo de Sangre"
        className={
          errors?.general?.currencies ? "selectInputCurrenciesError" : "selectInputCurrencies"
        }
        variant="borderless"
        optionLabelProp="label"
        {...field}
        options={options}
      />
      {errors?.general?.rh && (
        <Typography.Text className="textError">Campo es obligatorio *</Typography.Text>
      )}
    </>
  );
};
