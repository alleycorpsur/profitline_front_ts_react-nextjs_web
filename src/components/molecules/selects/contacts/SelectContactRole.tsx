import { Select, Typography } from "antd";
import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import {
  FieldError as OriginalFieldError,
  ControllerRenderProps,
  FieldErrorsImpl,
  Merge,
  FieldValues
} from "react-hook-form";

import "./commonInputStyles.scss";
import { IResponseContactOptions } from "@/types/contacts/IContacts";

type ExtendedFieldError =
  | OriginalFieldError
  | Merge<OriginalFieldError, FieldErrorsImpl<{ value: number; label: string }>>;

interface Props<T extends FieldValues> {
  errors: ExtendedFieldError | undefined;
  field: ControllerRenderProps<T, any>;
  readOnly?: boolean;
}

export const SelectContactRole = <T extends FieldValues>({ errors, field, readOnly }: Props<T>) => {
  const { data, isLoading } = useSWR<IResponseContactOptions>(
    "/client/contact/options",
    fetcher,
    {}
  );

  const options =
    data?.data && typeof data.data === "object"
      ? "contact_position" in data.data
        ? data?.data?.contact_position?.map((option) => {
            return {
              value: option.id,
              label: option.name,
              className: "selectOptions"
            };
          })
        : []
      : [];

  return (
    <>
      <Select
        placeholder="Seleccione el tipo de radicado"
        className={errors ? "selectInputError" : `selectInputCustom ${readOnly && "--readOnly"}`}
        loading={isLoading}
        variant="borderless"
        optionLabelProp="label"
        {...field}
        popupClassName="selectDrop"
        options={options}
        labelInValue
        open={readOnly ? false : undefined}
      />
      {errors && <Typography.Text className="textError">El rol es obligatorio *</Typography.Text>}
    </>
  );
};
