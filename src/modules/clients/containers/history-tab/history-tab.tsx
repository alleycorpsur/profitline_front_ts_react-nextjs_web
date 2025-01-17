import { useState } from "react";
import { Button, Flex, Spin } from "antd";
import { useParams } from "next/navigation";
import { DotsThree } from "phosphor-react";

import { extractSingleParam } from "@/utils/utils";
import { useClientHistory } from "@/hooks/useClientHistory";

import UiSearchInput from "@/components/ui/search-input";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import HistoryTable from "../../components/history-tab-table";
import ModalActionsHistoryTab from "../../components/history-tab-modal-generate-action";
import { ModalConfirmAction } from "@/components/molecules/modals/ModalConfirmAction/ModalConfirmAction";

import { IHistoryRow } from "@/types/clientHistory/IClientHistory";

import styles from "./history-tab.module.scss";

const HistoryTab = () => {
  const params = useParams();
  const clientIdParam = extractSingleParam(params.clientId);
  const [selectedRows, setSelectedRows] = useState<IHistoryRow[] | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState({ selected: 0 });
  const isLoading = false;

  const { data } = useClientHistory({ clientId: Number(clientIdParam) });

  const handleCancelApplication = () => {
    console.log("Anular aplicación");
    console.log(selectedRows);
    setOpenModal({ selected: 0 });
  };

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
                onClick={() => setOpenModal({ selected: 1 })}
              >
                Generar acción
              </Button>
            </Flex>
          </Flex>
          <HistoryTable dataAllRecords={data} setSelectedRows={setSelectedRows} />

          <ModalActionsHistoryTab
            isOpen={openModal.selected === 1}
            onClose={() => setOpenModal({ selected: 0 })}
            setSelectOpen={setOpenModal}
          />

          <ModalConfirmAction
            isOpen={openModal.selected === 2}
            onClose={() => setOpenModal({ selected: 0 })}
            title="¿Estás seguro que deseas anular esta apliación?"
            content="Esta acción es definitiva"
            onOk={handleCancelApplication}
            okText="Anular aplicación"
          />
        </div>
      )}
    </>
  );
};

export default HistoryTab;
