import { useState } from "react";
import { Flex, Spin } from "antd";
import UiSearchInput from "@/components/ui/search-input";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import HistoryTable from "../../components/history-tab-table";
import "./history-tab.scss";
import useHistoryData from "../../hooks/history-table";
import { useAppStore } from "@/lib/store/store";
import { extractSingleParam } from "@/utils/utils";
import { useParams } from "next/navigation";

const HistoryTab = () => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const params = useParams();
  const clientIdParam = extractSingleParam(params.clientId);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useHistoryData({ projectId, clientId: clientIdParam, search });
  console.log("data", data);
  if (isLoading)
    return (
      <Flex justify="center" align="center" style={{ height: "3rem" }}>
        <Spin />
      </Flex>
    );
  return (
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
      <HistoryTable dataAllRecords={data || []} />
    </div>
  );
};

export default HistoryTab;

// const mockData = [
//   {
//     id: 1,
//     create_at: "2021-09-01",
//     event: "Pago ingresado",
//     payment_id: 345678,
//     payment_amount: 100000000,
//     user: "Miguel Martinez"
//   },
//   {
//     id: 2,
//     create_at: "2021-10-01",
//     event: "Conciliacion",
//     payment_id: 345678,
//     payment_amount: 100000000,
//     user: "Miguel Martinez"
//   },
//   {
//     id: 3,
//     create_at: "2021-11-01",
//     event: "Aplicacion de pago",
//     payment_id: 345678,
//     payment_amount: 100000000,
//     user: "Miguel Martinez"
//   },
//   {
//     id: 4,
//     create_at: "2021-12-01",
//     event: "Circularizacion",
//     payment_id: 345678,
//     payment_amount: 1000000,
//     user: "Miguel Martinez"
//   },
//   {
//     id: 5,
//     create_at: "2021-13-01",
//     event: "Envio estado de cuenta",
//     payment_id: 345678,
//     payment_amount: 2340000000,
//     user: "Miguel Martinez"
//   }
// ];
