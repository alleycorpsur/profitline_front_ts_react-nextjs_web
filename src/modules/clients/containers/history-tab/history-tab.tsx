import { useState } from "react";
import { Flex, Spin } from "antd";
import { useParams } from "next/navigation";

import { extractSingleParam } from "@/utils/utils";
import { useClientHistory } from "@/hooks/useClientHistory";

import UiSearchInput from "@/components/ui/search-input";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import HistoryTable from "../../components/history-tab-table";

import "./history-tab.scss";

const HistoryTab = () => {
  const params = useParams();
  const clientIdParam = extractSingleParam(params.clientId);
  const [search, setSearch] = useState("");
  const isLoading = false;

  const { data } = useClientHistory({ clientId: Number(clientIdParam) });

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
          <HistoryTable dataAllRecords={data} />
        </div>
      )}
    </>
  );
};

export default HistoryTab;
