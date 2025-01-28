import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Flex, Spin } from "antd";
import { CaretDoubleRight } from "phosphor-react";
import LabelCollapse from "@/components/ui/label-collapse";
import UiSearchInput from "@/components/ui/search-input";
import AccountingAdjustmentsTable from "@/modules/clients/components/accounting-adjustments-table";
import Collapse from "@/components/ui/collapse";
import { useFinancialDiscounts } from "@/hooks/useFinancialDiscounts";
import { extractSingleParam } from "@/utils/utils";
import {
  FinancialDiscount,
  StatusFinancialDiscounts
} from "@/types/financialDiscounts/IFinancialDiscounts";
import "./accounting-adjustments-tab.scss";
import { useModalDetail } from "@/context/ModalContext";
import { mutate } from "swr";
import { useDebounce } from "@/hooks/useDeabouce";
import AccountingAdjustmentsFilter, {
  SelectedFiltersAccountingAdjustments
} from "@/components/atoms/Filters/FilterAccountingAdjustmentTab/FilterAccountingAdjustmentTab";

const AccountingAdjustmentsTab = () => {
  const [selectedRows, setSelectedRows] = useState<FinancialDiscount[] | undefined>(undefined);
  const [search, setSearch] = useState("");

  const params = useParams();
  const clientIdParam = extractSingleParam(params.clientId);
  const projectIdParam = extractSingleParam(params.projectId);
  const clientId = clientIdParam ? parseInt(clientIdParam) : 0;
  const projectId = projectIdParam ? parseInt(projectIdParam) : 0;
  const debouncedSearchQuery = useDebounce(search, 500);
  const [filters, setFilters] = useState<SelectedFiltersAccountingAdjustments>({
    lines: [],
    zones: [],
    channels: []
  });
  const { data, isLoading } = useFinancialDiscounts({
    clientId,
    projectId,
    id: debouncedSearchQuery ? parseInt(debouncedSearchQuery) : undefined,
    line: filters.lines,
    zone: filters.zones,
    channel: filters.channels
  });
  const { openModal, modalType } = useModalDetail();

  const handleOpenAdjustmentDetail = (adjustment: FinancialDiscount) => {
    openModal("adjustment", {
      selectAdjusment: adjustment,
      clientId,
      projectId,
      legalized: adjustment.legalized
    });
  };

  useEffect(() => {
    mutate(`/financial-discount/project/${projectId}/client/${clientId}`);
  }, [modalType]);

  return (
    <>
      <div className="accountingAdjustmentsTab">
        <Flex
          justify="space-between"
          className="accountingAdjustmentsTab__header clientStickyHeader"
        >
          <Flex gap={"0.5rem"}>
            <UiSearchInput
              className="search"
              placeholder="Buscar"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <AccountingAdjustmentsFilter onFilterChange={setFilters} />
          </Flex>
          <Button
            type="primary"
            className="availableAdjustments"
            onClick={() => console.log("click ajustes disponibles")}
          >
            Ajustes disponibles
            <CaretDoubleRight size={16} style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ height: "3rem" }}>
            <Spin />
          </Flex>
        ) : (
          <Collapse
            stickyLabel
            items={data?.map((financialState: StatusFinancialDiscounts) => ({
              key: financialState.status_id,
              label: (
                <LabelCollapse status={financialState.status_name} color={financialState.color} />
              ),
              children: (
                <>
                  <AccountingAdjustmentsTable
                    dataAdjustmentsByStatus={financialState.financial_discounts}
                    setSelectedRows={setSelectedRows}
                    openAdjustmentDetail={handleOpenAdjustmentDetail}
                    financialStatusId={financialState.status_id}
                    legalized={financialState.legalized}
                  />
                </>
              )
            }))}
          />
        )}
      </div>
    </>
  );
};

export default AccountingAdjustmentsTab;
