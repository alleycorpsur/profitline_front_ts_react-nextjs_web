import { Select } from "antd";
import useSWR from "swr";

import { ICountries } from "@/types/countries/ICountries";
import { fetcher } from "@/utils/api/api";

import "./selectcountries.scss";

interface Props {
  errors: any;
  field: any;
}
const { Option } = Select;
export const SelectCountries = ({ errors, field }: Props) => {
  const { data, isLoading } = useSWR<ICountries>("/country", fetcher, {});
  const options = data?.data;

  return (
    <Select
      placeholder="select one country"
      className={errors?.general?.countries ? "selectInputCountryError" : "selectInputCountry"}
      loading={isLoading}
      variant="borderless"
      optionLabelProp="label"
      {...field}
    >
      {options?.map((value, index) => {
        return (
          <Option value={`${value.id}-${value.country_name}`} key={index}>
            {`${value.id}-${value.country_name}`}
          </Option>
        );
      })}
    </Select>
  );
};
