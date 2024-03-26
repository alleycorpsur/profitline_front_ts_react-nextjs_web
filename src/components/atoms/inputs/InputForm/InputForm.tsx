import { Flex, Input, Typography } from "antd";

import { Control, Controller, FieldError } from "react-hook-form";

import "./inputform.scss";

interface Props {
  titleInput: string;
  nameInput: string;
  control: Control<any> | undefined;
  error: FieldError | undefined;
  typeInput?: string;
  customStyle?: any;
  hiddenTitle?: boolean;
  placeholder?: string;
}

export const InputForm = ({
  titleInput,
  nameInput,
  typeInput = "text",
  control,
  error,
  customStyle = {},
  hiddenTitle = false,
  placeholder = ""
}: Props) => {
  return (
    <Flex vertical className="containerInput" style={customStyle}>
      {!hiddenTitle && <Typography.Title level={5}>{titleInput}</Typography.Title>}
      <Controller
        name={nameInput as string}
        rules={{ required: true, maxLength: 123 }}
        control={control}
        render={({ field }) => (
          <Input
            type={typeInput}
            className={!error ? "input" : "inputError"}
            variant="borderless"
            placeholder={placeholder?.length > 0 ? placeholder : titleInput}
            {...field}
          />
        )}
      />
      <Typography.Text className="textError">
        {error && `${titleInput} es obligatorio *`}
      </Typography.Text>
    </Flex>
  );
};
