import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Cascader } from "antd";
import { useAppStore } from "@/lib/store/store";

import { getClientGroups } from "@/services/groupClients/groupClients";
import { getHoldingsByProjectId, IHoldingResponse } from "@/services/holding/holding";
import { IClientsGroupsFull } from "@/types/clientsGroups/IClientsGroups";

import "../filterCascader.scss";
interface Option {
  value: string;
  label: string;
  disableCheckbox?: boolean;
  isLeaf?: boolean;
  children?: Option[];
}

export interface SelectedFilters {
  holding: string[];
  clientGroup: string[];
}

interface Props {
  setSelectedFilters: Dispatch<SetStateAction<SelectedFilters>>;
}

export const FilterPortfolio = ({ setSelectedFilters }: Props) => {
  const { ID } = useAppStore((state) => state.selectedProject);
  const [holdings, setHoldings] = useState<Option[]>([]);
  const [clientGroups, setClientGroups] = useState<Option[]>([]);
  const [optionsList, setOptionsList] = useState<Option[]>(options);
  const [selectOptions, setSelectOptions] = useState<string[][]>([]);

  useEffect(() => {
    if (selectOptions.length === 0) {
      return setSelectedFilters({
        holding: [],
        clientGroup: []
      });
    }

    const holdingFilters = selectOptions
      .filter((item) => item[0] === "Holding")
      .map((item) => item[1]);
    const clientGroupFilters = selectOptions
      .filter((item) => item[0] === "Grupo de Cliente")
      .map((item) => item[1]);

    setSelectedFilters({
      holding: holdingFilters,
      clientGroup: clientGroupFilters
    });
  }, [selectOptions]);

  const onChange = (value: string[][]) => {
    setSelectOptions(value);
  };

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    if (targetOption.value === "Holding" && holdings.length === 0) {
      try {
        const response = await getHoldingsByProjectId(ID);
        const holdingsData = response.data as IHoldingResponse;
        const holdingsToShow: Option[] = holdingsData.data.map((holding) => ({
          label: holding.name,
          value: holding.id.toString()
        }));
        targetOption.children = holdingsToShow;
        setOptionsList([...optionsList]);
        setHoldings(holdingsToShow);
      } catch (error) {
        console.error("Error fetching holdings:", error);
      }
    }

    if (targetOption.value === "Grupo de Cliente" && clientGroups.length === 0) {
      try {
        const response = await getClientGroups(ID);
        const clientGroupsData = response.data as IClientsGroupsFull;
        const clientGroupsToShow: Option[] = clientGroupsData.data.map((group) => ({
          label: group.group_name,
          value: group.id.toString()
        }));
        targetOption.children = clientGroupsToShow;
        setOptionsList([...optionsList]);
        setClientGroups(clientGroupsToShow);
      } catch (error) {
        console.error("Error fetching client groups:", error);
      }
    }
  };

  return (
    <Cascader
      className="filterCascader"
      style={{ width: "120px", height: "46px" }}
      multiple
      size="large"
      removeIcon
      maxTagCount="responsive"
      placeholder="Filtrar"
      placement="bottomRight"
      onClear={() => setSelectedFilters({ holding: [], clientGroup: [] })}
      options={optionsList}
      changeOnSelect
      loadData={loadData}
      value={selectOptions}
      onChange={onChange}
    />
  );
};

const options: Option[] = [
  {
    value: "Holding",
    label: "Holding",
    isLeaf: false,
    disableCheckbox: true
  },
  {
    value: "Grupo de Cliente",
    label: "Grupo de Cliente",
    isLeaf: false,
    disableCheckbox: true
  }
];
