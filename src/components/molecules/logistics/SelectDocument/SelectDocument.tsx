import { Select } from "antd";

import "./SelectDocument.scss";

interface Props {
  errors: any;
  field: any;
  selected?: any;
}

export const SelectDocument = ({ errors, field, selected }: Props) => {
  const data = {
    data: [
      {
        id: 1,
        value: "Cedula de ciudadania"
      },
      {
        id: 2,
        value: "Tarjeta de identidad"
      },
      {
        id: 3,
        value: "Pasaporte"
      }
    ]
  };
  const options = data?.data.map((option) => {
    return {
      value: option.id,
      label: option.value
    };
  });

    return (
      <Select
        placeholder="Selecciona Tipo de Sangre"
        className={
          errors?.general?.document_type ? "selectInputCurrenciesError" : "selectInputCurrencies"
        }
        variant="borderless"
        optionLabelProp="label"
        {...field}
        options={options}
      />
    );
};
