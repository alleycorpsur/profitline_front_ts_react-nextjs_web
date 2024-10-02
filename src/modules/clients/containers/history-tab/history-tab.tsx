import { useState } from "react";
import { Flex, Spin } from "antd";

import UiSearchInput from "@/components/ui/search-input";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import HistoryTable from "../../components/history-tab-table";

import "./history-tab.scss";

const HistoryTab = () => {
  const [search, setSearch] = useState("");
  const isLoading = false;

  return (
    <>
      {isLoading ? (
        <Flex justify="center" align="center" style={{ height: "3rem" }}>
          <Spin />
        </Flex>
      ) : (
        <div className="historyTab">
          <Flex justify="space-between" className="historyTab__header">
            <Flex gap={"0.5rem"}>
              <UiSearchInput
                className="search"
                placeholder="Buscar"
                onChange={(event) => {
                  setTimeout(() => {
                    setSearch(event.target.value);
                  }, 1000);
                }}
              />
              <UiFilterDropdown />
              <DotsDropdown />
            </Flex>
          </Flex>
          <HistoryTable dataAllRecords={mockData} />
        </div>
      )}
    </>
  );
};

export default HistoryTab;

export interface IHistoryRecord {
  id: number;
  create_at: string;
  event: string;
  payment_id: number;
  payment_amount: number;
  user: string;
}

const mockData = [
  {
    id: 1,
    create_at: "2021-09-01",
    event: "Pago ingresado",
    payment_id: 345678,
    payment_amount: 100000000,
    user: "Miguel Martinez"
  },
  {
    id: 2,
    create_at: "2021-10-01",
    event: "Conciliacion",
    payment_id: 345678,
    payment_amount: 100000000,
    user: "Miguel Martinez"
  },
  {
    id: 3,
    create_at: "2021-11-01",
    event: "Aplicacion de pago",
    payment_id: 345678,
    payment_amount: 100000000,
    user: "Miguel Martinez"
  },
  {
    id: 4,
    create_at: "2021-12-01",
    event: "Circularizacion",
    payment_id: 345678,
    payment_amount: 1000000,
    user: "Miguel Martinez"
  },
  {
    id: 5,
    create_at: "2021-13-01",
    event: "Envio estado de cuenta",
    payment_id: 345678,
    payment_amount: 2340000000,
    user: "Miguel Martinez"
  }
];
