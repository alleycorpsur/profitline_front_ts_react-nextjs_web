import { Select } from "antd";
import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { ICurrencies } from "@/types/currencies/ICurrencies";

import "./selectcurrencies.scss";

interface Props {
  errors: any;
  field: any;
}
const { Option } = Select;
export const SelectCurrencies = ({ errors, field }: Props) => {
  const { data, isLoading } = useSWR<ICurrencies>("/currency", fetcher, {});
  const options = data?.data;

  return (
    <Select
      mode="multiple"
      placeholder="Selecciona las currency"
      className={
        errors?.general?.countries ? "selectInputCurrenciesError" : "selectInputCurrencies"
      }
      loading={isLoading}
      variant="borderless"
      optionLabelProp="label"
      {...field}
    >
      {options?.map((value, index) => {
        return (
          <Option value={`${value.ID}-${value.CURRENCY_NAME}`} key={index}>
            {`${value.ID}-${value.CURRENCY_NAME}`}
          </Option>
        );
      })}
    </Select>
  );
};
