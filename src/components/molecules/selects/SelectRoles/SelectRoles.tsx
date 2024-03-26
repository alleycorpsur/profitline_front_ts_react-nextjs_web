import { Select, Typography } from "antd";
import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { IRoles } from "@/types/roles/IRoles";

import "./selectroles.scss";

interface Props {
  errors: any;
  field: any;
}
const { Option } = Select;
export const SelectRoles = ({ errors, field }: Props) => {
  const { data, isLoading } = useSWR<IRoles>("/role", fetcher, {});
  // doesn't show super admin role
  const options = data?.data.filter((rol) => rol.ID !== 1);
  return (
    <Select
      placeholder="Selecciona los roles"
      className={errors ? "selectInputRolesError" : "selectInputRoles"}
      loading={isLoading}
      variant="borderless"
      optionLabelProp="label"
      {...field}
    >
      {options?.map((value) => {
        return (
          <Option value={`${value.ID}-${value.ROL_NAME}`} key={value.ID}>
            {`${value.ID}-${value.ROL_NAME}`}
          </Option>
        );
      })}
      {errors && <Typography.Text className="textError">Rol es obligatorio *</Typography.Text>}
    </Select>
  );
};
