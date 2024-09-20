import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Flex, Input, Typography } from "antd";
import "./InputPhone.scss"; // Importa tus estilos personalizados

interface NumberInputProps {
  name: string;
  control: Control<any>;
  titleInput: string;
  placeholder?: string;
  error?: FieldError;
  validationRules?: RegisterOptions;
  customClassName?: string;
  count?: any;
  hiddenTitle?: boolean;
  readOnly?: boolean;
}

const NumberInput = ({
  name,
  control,
  titleInput,
  placeholder = "",
  error,
  validationRules = {},
  customClassName = "",
  count,
  hiddenTitle = false,
  readOnly = false
}: NumberInputProps) => {
  return (
    <Flex vertical className={`containerInput ${customClassName}`}>
      {!hiddenTitle && (
        <Typography.Title className="input-form-title" level={5}>
          {titleInput}
        </Typography.Title>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field }) => (
          <NumericFormat
            {...field}
            readOnly={readOnly}
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={0}
            valueIsNumericString
            customInput={Input}
            placeholder={placeholder || titleInput}
            className={!error ? `inputForm ${readOnly && "-readOnly"}` : "inputFormError"}
            count={count}
          />
        )}
      />
      <Typography.Text className="textError">
        {error ? (error.message ? ` ${error.message}` : `${titleInput} es obligatorio *`) : ""}
      </Typography.Text>
    </Flex>
  );
};

export default NumberInput;
