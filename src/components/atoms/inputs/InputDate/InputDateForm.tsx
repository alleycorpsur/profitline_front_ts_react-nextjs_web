import React from "react";
import { DatePicker, Flex, Typography } from "antd";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import { Calendar } from "phosphor-react";

import "./inputDateForm.scss";

interface InputDateFormProps {
  titleInput: string;
  nameInput: string;
  control: Control<any> | undefined;
  error: FieldError | undefined;
  hiddenTitle?: boolean;
  placeholder?: string;
  disabled?: boolean;
  validationRules?: RegisterOptions;
  className?: string;
}

export const InputDateForm = ({
  titleInput,
  nameInput,
  control,
  error,
  hiddenTitle = false,
  placeholder = "",
  disabled,
  validationRules,
  className
}: InputDateFormProps) => {
  return (
    <Flex vertical className={`datePickerContainer ${className}`}>
      {!hiddenTitle && <p className="input-date-custom-title">{titleInput}</p>}
      <Controller
        name={nameInput}
        rules={{ required: true, ...validationRules }}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            onChange={(date) => field.onChange(date)}
            value={field.value}
            size="large"
            disabled={disabled}
            placeholder={placeholder || `Select ${titleInput.toLowerCase()}`}
            suffixIcon={<Calendar className="dateInputForm__icon" />}
            className={!error ? "dateInputForm" : "dateInputFormError"}
          />
        )}
      />
      {error && (
        <Typography.Text className="textError">
          {error.message || `${titleInput} is required`}
        </Typography.Text>
      )}
    </Flex>
  );
};
