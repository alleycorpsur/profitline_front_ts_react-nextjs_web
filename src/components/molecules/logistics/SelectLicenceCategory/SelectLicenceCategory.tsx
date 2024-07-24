import { Select, Typography } from "antd";

import "./SelectLicenceCategory.scss";

interface Props {
  errors: any;
  field: any;
  selected?: any;
}

export const licences = {
  data: [
    {
      id: 1,
      value: "B1"
    },
    {
      id: 2,
      value: "B2"
    },
    {
      id: 3,
      value: "B3"
    },
    {
      id: 4,
      value: "C1"
    },
    {
      id: 5,
      value: "C2"
    },
    {
      id: 6,
      value: "C3"
    },
  ]
};

export const SelectLCategory = ({ errors, field, selected }: Props) => {
  const options = licences?.data.map((option) => {
    return {
      value: option.id,
      label: option.value
    };
  });

    return (
      <>
      <Select
        placeholder="Selecciona categoria de la licencia"
        className={
          errors?.general?.currencies ? "selectInputCurrenciesError" : "selectInputCurrencies"
        }
        variant="borderless"
        optionLabelProp="label"
        {...field}
        options={options}
      />
      {errors && <Typography.Text className="textError">Campo es obligatorio *</Typography.Text>}
      </>
    );
};
