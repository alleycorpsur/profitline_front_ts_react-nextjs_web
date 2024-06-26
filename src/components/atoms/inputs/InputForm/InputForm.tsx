import { Flex, Input, Typography } from "antd";

import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";

import "./inputform.scss";

interface Props {
  titleInput?: string;
  nameInput: string;
  control: Control<any> | undefined;
  error: FieldError | undefined;
  typeInput?: string;
  customStyle?: any;
  hiddenTitle?: boolean;
  placeholder?: string;
  disabled?: boolean;
  validationRules?: RegisterOptions;
  className?: string;
  readOnly?: boolean;
}

export const InputForm = ({
  titleInput,
  nameInput,
  typeInput = "text",
  control,
  error,
  customStyle = {},
  hiddenTitle = false,
  placeholder = "",
  disabled,
  validationRules,
  className,
  readOnly
}: Props) => {
  return (
    <Flex vertical className={`containerInput ${className}`} style={customStyle}>
      {!hiddenTitle && (
        <Typography.Title className="input-form-title" level={5}>
          {titleInput}
        </Typography.Title>
      )}
      <Controller
        name={nameInput}
        rules={{ required: true, maxLength: 123, ...validationRules }}
        control={control}
        disabled={disabled}
        render={({ field }) => (
          <Input
            readOnly={readOnly}
            type={typeInput}
            className={!error ? "inputForm" : "inputFormError"}
            variant="borderless"
            placeholder={placeholder?.length > 0 ? placeholder : titleInput}
            {...field}
          />
        )}
      />
      <Typography.Text className="textError">
        {error ? (error.message ? ` ${error.message}` : `${titleInput} es obligatorio *`) : ""}
      </Typography.Text>
    </Flex>
  );
};
