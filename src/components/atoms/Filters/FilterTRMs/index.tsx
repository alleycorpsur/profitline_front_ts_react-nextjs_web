import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dropdown, Menu, Checkbox, Button, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
const { Text } = Typography;

export interface FilterOption {
  label: string;
  value: string;
}
interface Props {
  selectedKeys: FilterOption[];
  setSelectedKeys: Dispatch<SetStateAction<FilterOption[]>>;
}
interface OptionApi {
  id: string;
  description: string;
}
const FilterTRMs = ({ selectedKeys, setSelectedKeys }: Props) => {
  const { data, isLoading } = useSWR<GenericResponse<OptionApi[]>>(
    "/client/condition-payments", // <-- fetch the data from the API
    fetcher,
    {}
  );
  // const options = data?.data.map((option) => {
  //   return {
  //     value: option.id,
  //     label: option.description
  //   };
  // });
  const options: FilterOption[] = [
    { label: "USD - COP", value: "usd-cop" },
    { label: "COP - USD", value: "cop-usd" },
    { label: "USD - MXN", value: "usd-mxn" },
    { label: "MXN - COP", value: "mxn-cop" },
    { label: "USD - ARS", value: "usd-ars" },
    { label: "ARS - USD", value: "ars-usd" }
  ];
  // Límite máximo de selección
  const MAX_SELECTION = 5;
  const handleCheckboxChange = (option: FilterOption) => {
    // Si ya hemos alcanzado el límite, no permitir seleccionar más opciones
    if (
      selectedKeys.length >= MAX_SELECTION &&
      !selectedKeys.some((item) => item.value === option.value)
    ) {
      return;
    }

    setSelectedKeys(
      (prev) =>
        prev.some((item) => item.value === option.value)
          ? prev.filter((item) => item.value !== option.value) // Deseleccionar
          : [...prev, option] // Seleccionar
    );
  };

  const menu = (
    <Menu
      style={{
        backgroundColor: "#FFFFFF",
        width: "14rem",
        display: "flex",
        flexDirection: "column",
        rowGap: "8px"
      }}
    >
      {options?.map((option) => (
        <Menu.Item
          key={option.value}
          style={{
            padding: "6px 10px",
            borderRadius: "0.5rem",
            border: "1px solid #141414"
          }}
        >
          <Checkbox
            checked={selectedKeys.some((item) => item.value === option.value)}
            onChange={() => handleCheckboxChange(option)}
            disabled={
              selectedKeys.length >= MAX_SELECTION &&
              !selectedKeys.some((item) => item.value === option.value)
            } // Deshabilitar opciones si el límite se ha alcanzado
          >
            {option.label}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        style={{ width: "7rem", height: "100%", display: "flex", justifyContent: "space-evenly" }}
      >
        <Text strong style={{ fontSize: "16px" }}>
          Tasas
        </Text>
        <DownOutlined size={16} />
      </Button>
    </Dropdown>
  );
};

export default FilterTRMs;
