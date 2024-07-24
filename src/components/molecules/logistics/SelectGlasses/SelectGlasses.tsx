import { Select, Typography } from "antd";

import "./SelectGlasses.scss";

interface Props {
  errors: any;
  field: any;
  selected?: any;
}

export const glasses = {
  data: [
    {
      id: 1,
      value: "Si"
    },
    {
      id: 2,
      value: "No"
    }
  ]
};
export const SelectGlasses = ({ errors, field, selected }: Props) => {
  const options = glasses?.data.map((option) => {
    return {
      value: option.id,
      label: option.value
    };
  });


    return (
      <>
      <Select
        placeholder="Selecciona"
        className={"selectInputGlasses"}
        variant="borderless"
        optionLabelProp="label"
        {...field}
        options={options}
      />
      {errors && <Typography.Text className="textError">Campo es obligatorio *</Typography.Text>}
    </>
    );
};
