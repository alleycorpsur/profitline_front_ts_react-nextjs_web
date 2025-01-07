import { useState } from "react";
import { Button, Flex, Spin } from "antd";
import { useParams } from "next/navigation";

import { extractSingleParam } from "@/utils/utils";
import { useClientHistory } from "@/hooks/useClientHistory";

import UiSearchInput from "@/components/ui/search-input";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import HistoryTable from "../../components/history-tab-table";

import styles from "./history-tab.module.scss";
import { DotsThree } from "phosphor-react";
import { IHistoryRow } from "@/types/clientHistory/IClientHistory";

const HistoryTab = () => {
  const params = useParams();
  const clientIdParam = extractSingleParam(params.clientId);
  const [selectedRows, setSelectedRows] = useState<IHistoryRow[] | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState({ selected: 0 });
  const isLoading = false;

  const { data } = useClientHistory({ clientId: Number(clientIdParam) });

  return (
    <>
      {isLoading ? (
        <Flex justify="center" align="center" style={{ height: "3rem" }}>
          <Spin />
        </Flex>
      ) : (
        <div className={styles.historyTab}>
          <Flex justify="space-between">
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
              <Button
                className={styles.button__actions}
                size="large"
                icon={<DotsThree size={"1.5rem"} />}
                disabled={false}
                onClick={() => setOpenModal({ selected: 1 })}
              >
                Generar acción
              </Button>
            </Flex>
          </Flex>
          <HistoryTable dataAllRecords={data} setSelectedRows={setSelectedRows} />
        </div>
      )}
    </>
  );
};

export default HistoryTab;
