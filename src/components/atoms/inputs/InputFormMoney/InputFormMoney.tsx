import { Flex, Input, Typography } from "antd";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import "./inputFormMoney.scss";
import { useAppStore } from "@/lib/store/store";

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
  const formatMoney = useAppStore((state) => state.formatMoney);

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
    return value.replace(/\./g, "").replace(/,/g, ".");
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
            value={formatMoney(value, { hideCurrencySymbol: true })}
            onChange={(e) => {
              console.log("value", value);
              console.log("targe value", e.target.value);
              const rawValue = parseNumber(e.target.value);
              console.log("rawValue", rawValue);
              // const formattedValue = formatNumber(rawValue);
              const formattedValue = formatMoney(rawValue, { hideCurrencySymbol: true });
              console.log("formattedValue", formattedValue);
              const numericValue = parseNumber(formattedValue);
              onChange(numericValue);
              changeInterceptor?.(numericValue);
            }}
            {...field}
          />
        )}
      />
      <p>{formatMoney(-9999, { hideCurrencySymbol: true })}</p>
      <Typography.Text className="textError">
        {error ? (error.message ? ` ${error.message}` : `${titleInput} es obligatorio *`) : ""}
      </Typography.Text>
    </Flex>
  );
};
