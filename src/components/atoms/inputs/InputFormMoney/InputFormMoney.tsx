import { Flex, Input, Typography } from "antd";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import "./inputFormMoney.scss";

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
  defaultValue?: any;
  // eslint-disable-next-line no-unused-vars
  changeInterceptor?: (value: any) => void;
}

export const InputFormMoney = ({
  titleInput,
  nameInput,
  control,
  error,
  customStyle = {},
  hiddenTitle = false,
  placeholder = "",
  disabled,
  validationRules,
  className,
  readOnly,
  defaultValue,
  changeInterceptor
}: Props) => {
  const formatNumber = (value: string | number): string => {
    if (!value) return "";

    let numStr = String(value);

    // Allow negative sign at the start but prevent multiple ones
    const isNegative = numStr.startsWith("-");

    numStr = numStr.replace(/[^0-9]/g, ""); // Remove all non-numeric characters

    const formattedNumStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return isNegative ? `-${formattedNumStr}` : formattedNumStr;
  };

  const parseNumber = (value: string): string => {
    return value.replace(/\./g, "");
  };

  return (
    <Flex vertical className={`containerInput__format ${className}`} style={customStyle}>
      {!hiddenTitle && (
        <Typography.Title className="input-form-title" level={5}>
          {titleInput}
        </Typography.Title>
      )}
      <Controller
        name={nameInput}
        rules={{ required: true, ...validationRules }}
        control={control}
        disabled={disabled}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            readOnly={readOnly}
            className={!error ? `inputForm ${readOnly ? "-readOnly" : ""}` : "inputFormError"}
            placeholder={placeholder?.length > 0 ? placeholder : titleInput}
            value={formatNumber(value)}
            onChange={(e) => {
              const rawValue = e.target.value;
              const formattedValue = formatNumber(rawValue);
              const numericValue = parseNumber(formattedValue);
              onChange(numericValue);
              changeInterceptor?.(numericValue);
            }}
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
