import { FC, useState } from "react";
import { Button, Flex, MenuProps } from "antd";
import { Bank } from "phosphor-react";

import { useModalDetail } from "@/context/ModalContext";
import { useMessageApi } from "@/context/MessageContext";
import { useAppStore } from "@/lib/store/store";

import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import Collapse from "@/components/ui/collapse";
import LabelCollapse from "@/components/ui/label-collapse";
import BanksTable from "../../components/banks-table/Banks-table";
import BanksRules from "../bank-rules";
import ModalActionsBanksPayments from "../../components/modal-actions-banks-payments";
import ModalActionsEditClient from "../../components/modal-actions-edit-client";
import ModalActionsUploadEvidence from "../../components/modal-actions-upload-evidence";
import ModalActionsAssignClient from "../../components/modal-actions-assign-client";

import styles from "./active-payments-tab.module.scss";

export const ActivePaymentsTab: FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[] | undefined>();
  const [showBankRules, setShowBankRules] = useState<boolean>(false);
  const [isGenerateActionOpen, setisGenerateActionOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState({
    selected: 0
  });
  const { ID } = useAppStore((state) => state.selectedProject);

  const { showMessage } = useMessageApi();

  const { openModal } = useModalDetail();
  const handleOpenBankRules = () => {
    setShowBankRules(true);
  };

  const handleOpenPaymentDetail = (payment: any) => {
    openModal("payment", {
      paymentId: payment.id,
      projectId: ID
    });
  };

  const onCloseModal = () => {
    setisGenerateActionOpen(!isGenerateActionOpen);
    setIsSelectOpen({ selected: 0 });
    // TODO: uncomment when mutate is implemented
    // mutate();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          className="buttonOutlined"
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
      )
    }
  ];

  return (
    <>
      {showBankRules ? (
        <BanksRules onClickBack={() => setShowBankRules(false)} />
      ) : (
        <Flex className={styles.activePaymentsTab} vertical>
          <div className={styles.header}>
            <UiSearchInput
              placeholder="Buscar"
              onChange={(event) => {
                setTimeout(() => {
                  console.info(event.target.value);
                }, 1000);
              }}
            />
            <FilterDiscounts />
            <DotsDropdown items={items} />
            <PrincipalButton onClick={handleOpenBankRules} customStyles={{ marginLeft: "auto" }}>
              Reglas de bancos
              <Bank size={16} />
            </PrincipalButton>
          </div>

          <Collapse
            items={mockBank?.map((status) => ({
              key: status.status_id,
              label: (
                <LabelCollapse
                  status={status.status_name}
                  color={status.color}
                  quantity={status.clients.length}
                  total={status.total}
                />
              ),
              children: (
                <BanksTable
                  clientsByStatus={status.clients.map((client) => {
                    return {
                      ...client,
                      client_status_id: status.status_id
                    };
                  })}
                  handleOpenPaymentDetail={handleOpenPaymentDetail}
                  setSelectedRows={setSelectedRows}
                  bankStatusId={status.status_id}
                />
              )
            }))}
          />
          <ModalActionsBanksPayments
            isOpen={isGenerateActionOpen}
            onClose={() => {
              setisGenerateActionOpen(false);
            }}
            setSelectOpen={(e) => {
              setisGenerateActionOpen((prev) => !prev);
              setIsSelectOpen(e);
            }}
          />

          <ModalActionsEditClient isOpen={isSelectOpen.selected === 1} onClose={onCloseModal} />
          <ModalActionsAssignClient isOpen={isSelectOpen.selected === 2} onClose={onCloseModal} />
          <ModalActionsUploadEvidence isOpen={isSelectOpen.selected === 5} onClose={onCloseModal} />
        </Flex>
      )}
    </>
  );
};

export default ActivePaymentsTab;

const mockBank = [
  {
    status_id: 1,
    status_name: "Identificado",
    color: "#0085FF",
    total: 300000,
    clients: [
      {
        id: 1,
        client_name: "Cliente 1",
        date: "30/09/2021",
        amount: 150000,
        description: "Descripcion",
        account_number: 123456,
        account_bank: "Bancolombia",
        state_name: "identificado",
        state_color: "#0085FF"
      },
      {
        id: 2,
        client_name: "Cliente 2",
        date: "30/09/2021",
        amount: 150000,
        description: "Descripcion2",
        account_number: 123456,
        account_bank: "Bancolombia",
        state_name: "Auditoria",
        state_color: "#FE7A01"
      }
    ]
  },
  {
    status_id: 2,
    status_name: "En auditoria",
    total: 300000,
    color: "#FE7A01",
    clients: [
      {
        id: 3,
        client_name: "Cliente 3",
        date: "30/09/2021",
        amount: 150000,
        description: "Descripcion",
        account_number: 123456,
        account_bank: "Bancolombia",
        state_name: "identificado",
        state_color: "#0085FF"
      },
      {
        id: 4,
        client_name: "Cliente 4",
        date: "30/09/2021",
        amount: 150000,
        description: "Descripcion2",
        account_number: 123456,
        account_bank: "Bancolombia",
        state_name: "Auditoria",
        state_color: "#FE7A01"
      }
    ]
  }
];
