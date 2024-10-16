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
  changeInterceptor
}: Props) => {
  const formatNumber = (value: string): string => {
    if (!value) return "";
    else if (typeof value !== "string") value = String(value);
    const numStr = String(value).replace(/\D/g, "");
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            readOnly={readOnly}
            className={!error ? `inputForm ${readOnly ? "-readOnly" : ""}` : "inputFormError"}
            placeholder={placeholder?.length > 0 ? placeholder : titleInput}
            value={formatNumber(value)}
            onChange={(e) => {
              const formattedValue = formatNumber(e.target.value);
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
