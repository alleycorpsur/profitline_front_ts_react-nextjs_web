import { FC, useState, useEffect } from "react";
import { Button, Flex, Spin } from "antd";
import { Bank, DotsThree } from "phosphor-react";

import { useModalDetail } from "@/context/ModalContext";
import { useMessageApi } from "@/context/MessageContext";
import { useAppStore } from "@/lib/store/store";
import { useBankPayments } from "@/hooks/useBankPayments";

import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import Collapse from "@/components/ui/collapse";
import LabelCollapse from "@/components/ui/label-collapse";
import BanksTable from "../../components/banks-table/Banks-table";
import BanksRules from "../bank-rules";
import ModalActionsBanksPayments from "../../components/modal-actions-banks-payments";
import ModalActionsEditClient from "../../components/modal-actions-edit-client";
import ModalActionsUploadEvidence from "../../components/modal-actions-upload-evidence";
import ModalActionsAssignClient from "../../components/modal-actions-assign-client";
import ModalActionsSplitPayment from "../../components/modal-actions-split-payment";
import ModalActionsChangeStatus from "../../components/modal-actions-change-status";
import { ModalConfirmAction } from "@/components/molecules/modals/ModalConfirmAction/ModalConfirmAction";

import { ISingleBank } from "@/types/banks/IBanks";
import { IClientPayment } from "@/types/clientPayments/IClientPayments";

import styles from "./active-payments-tab.module.scss";

export const ActivePaymentsTab: FC = () => {
  const [selectedRows, setSelectedRows] = useState<ISingleBank[]>();
  const [showBankRules, setShowBankRules] = useState<boolean>(false);
  const [isGenerateActionOpen, setisGenerateActionOpen] = useState(false);
  const [clearSelected, setClearSelected] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState({ selected: 0 });
  const [mutatedPaymentDetail, mutatePaymentDetail] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paymentMaps, setPaymentMaps] = useState<Map<number, Map<string, ISingleBank>>>(new Map());
  const [loadingApprove, setLoadingApprove] = useState(false);

  const { ID } = useAppStore((state) => state.selectedProject);
  const { showMessage } = useMessageApi();
  const { openModal } = useModalDetail();
  const { data, isLoading, mutate } = useBankPayments({ projectId: ID });

  useEffect(() => {
    if (data) {
      const maps = new Map();
      data.forEach((status) => {
        const paymentMap = new Map();
        status.payments.forEach((payment) => {
          paymentMap.set(payment.id.toString(), payment);
        });
        maps.set(status.payments_status_id, paymentMap);
      });
      setPaymentMaps(maps);
    }
  }, [data]);

  const searchPayments = (statusId: number, query: string): ISingleBank[] => {
    if (!query) return data?.find((s) => s.payments_status_id === statusId)?.payments || [];

    const paymentMap = paymentMaps.get(statusId);
    if (!paymentMap) return [];

    return Array.from(paymentMap.entries())
      .filter(([id]) => id.includes(query))
      .map(([, payment]) => payment);
  };

  const handleOpenBankRules = () => {
    setShowBankRules(true);
  };

  const handleActionInDetail = (selectedPayment: ISingleBank | IClientPayment): void => {
    setisGenerateActionOpen(!isGenerateActionOpen);
    setSelectedRows([selectedPayment as ISingleBank]);
    mutate();
  };

  const handleOpenPaymentDetail = (paymentId: number) => {
    openModal("payment", {
      paymentId,
      handleActionInDetail,
      handleOpenPaymentDetail,
      mutatedPaymentDetail
    });
  };

  const onCloseModal = (cancelClicked?: Boolean) => {
    setIsSelectOpen({ selected: 0 });

    if (cancelClicked) return setisGenerateActionOpen(!isGenerateActionOpen);

    setClearSelected(!clearSelected);
    setSelectedRows([]);
    mutate();

    mutatePaymentDetail((prev) => !prev);
    openModal("payment", {
      paymentId: selectedRows?.[0]?.id || 0,
      handleActionInDetail,
      handleOpenPaymentDetail,
      mutatedPaymentDetail: !mutatedPaymentDetail
    });
  };

  const handleApproveAssignment = () => {
    console.log("OKKK");
  };
  const filteredData = data
    ?.map((status) => ({
      ...status,
      payments: searchPayments(status.payments_status_id, searchQuery)
    }))
    .filter((status) => status.payments.length > 0);

  return (
    <>
      {showBankRules ? (
        <BanksRules onClickBack={() => setShowBankRules(false)} />
      ) : isLoading ? (
        <Flex justify="center">
          <Spin style={{ margin: "30px" }} />
        </Flex>
      ) : (
        <Flex className={styles.activePaymentsTab} vertical>
          <div className={styles.header}>
            <UiSearchInput
              placeholder="Buscar por ID"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <FilterDiscounts />
            <Button
              className={styles.button__actions}
              icon={<DotsThree size={"1.5rem"} />}
              onClick={() => {
                if (!selectedRows || selectedRows.length === 0) {
                  showMessage("error", "Seleccione al menos un pago");
                  return;
                }
                setisGenerateActionOpen(true);
              }}
            >
              Generar acción
            </Button>
            <PrincipalButton onClick={handleOpenBankRules} customStyles={{ marginLeft: "auto" }}>
              Reglas de bancos
              <Bank size={16} />
            </PrincipalButton>
          </div>

          <Collapse
            items={filteredData?.map((status) => ({
              key: status.payments_status_id,
              label: (
                <LabelCollapse
                  status={status.payments_status}
                  color={status.color}
                  quantity={status.payments.length}
                  total={status.total_account || 0}
                />
              ),
              children: (
                <BanksTable
                  clientsByStatus={status.payments.map((client) => ({
                    ...client,
                    client_status_id: status.payments_status_id
                  }))}
                  handleOpenPaymentDetail={handleOpenPaymentDetail}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  bankStatusId={status.payments_status_id}
                  clearSelected={clearSelected}
                />
              )
            }))}
          />

          <ModalActionsBanksPayments
            isOpen={isGenerateActionOpen}
            onClose={() => setisGenerateActionOpen(false)}
            setSelectOpen={(e) => {
              const { selected } = e;
              if (selected !== 2 && selected !== 6 && selectedRows && selectedRows.length > 1) {
                showMessage("info", "Solo puedes seleccionar un pago para esta acción");
                return;
              }

              if (selected === 6 && selectedRows && selectedRows.length > 1) {
                const clientId = selectedRows[0].id_client;
                if (!selectedRows.every((row) => row.id_client === clientId)) {
                  showMessage(
                    "info",
                    "Solo puedes seleccionar pagos del mismo cliente para esta acción"
                  );
                  return;
                }
              }

              setisGenerateActionOpen((prev) => !prev);
              setIsSelectOpen(e);
            }}
          />

          <ModalActionsEditClient
            isOpen={isSelectOpen.selected === 1}
            onClose={onCloseModal}
            selectedRows={selectedRows}
          />
          <ModalActionsAssignClient
            isOpen={isSelectOpen.selected === 2}
            onClose={onCloseModal}
            selectedRows={selectedRows}
          />
          <ModalConfirmAction
            isOpen={isSelectOpen.selected === 3}
            onClose={onCloseModal}
            onOk={handleApproveAssignment}
            title="¿Está seguro de quere aprobar la asignación?"
            okText="Aprobar"
            okLoading={loadingApprove}
          />
          <ModalActionsSplitPayment
            isOpen={isSelectOpen.selected === 4}
            onClose={onCloseModal}
            selectedRows={selectedRows}
          />
          <ModalActionsUploadEvidence
            isOpen={isSelectOpen.selected === 5}
            onClose={onCloseModal}
            selectedRows={selectedRows}
          />
          <ModalActionsChangeStatus
            isOpen={isSelectOpen.selected === 6}
            onClose={onCloseModal}
            selectedRows={selectedRows}
          />
        </Flex>
      )}
    </>
  );
};

export default ActivePaymentsTab;
