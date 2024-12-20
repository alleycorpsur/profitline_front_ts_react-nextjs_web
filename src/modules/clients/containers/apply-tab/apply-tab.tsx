import React, { useMemo, useState } from "react";
import { Plus } from "phosphor-react";
import { Button, Flex, Spin } from "antd";

import { useApplicationTable } from "@/hooks/useApplicationTable";
import Collapse from "@/components/ui/collapse";
import LabelCollapse from "@/components/ui/label-collapse";
import { useParams } from "next/navigation";

import { useAppStore } from "@/lib/store/store";
import { extractSingleParam } from "@/utils/utils";
import { addItemsToTable } from "@/services/applyTabClients/applyTabClients";
import { useMessageApi } from "@/context/MessageContext";
import { useSelectedPayments } from "@/context/SelectedPaymentsContext";

import UiSearchInput from "@/components/ui/search-input/search-input";
import InvoiceTable from "./tables/InvoiceTable";
import PaymentsTable from "./tables/PaymentsTable";
import DiscountTable from "./tables/DiscountTable";
import { ModalResultAppy } from "./Modals/ModalResultApply/ModalResultAppy";
import ModalAddToTables from "./Modals/ModalAddToTables/ModalAddToTables";
import { ModalSelectAjustements } from "./Modals/ModalSelectAjustements/ModalSelectAjustements";
import ModalListAdjustments from "./Modals/ModalListAdjustments/ModalListAdjustments";
import ModalCreateAdjustment from "./Modals/ModalCreateAdjustment/ModalCreateAdjustment";

import "./apply-tab.scss";
export interface IModalAddToTableOpen {
  isOpen: boolean;
  adding?: "invoices" | "payments";
}
const ApplyTab: React.FC = () => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const params = useParams();
  const clientId = Number(extractSingleParam(params.clientId)) || 0;
  const [search, setSearch] = useState("");
  const { showMessage } = useMessageApi();

  //TODO this is the context that is not being used
  // const { selectedPayments } = useSelectedPayments();

  const [isModalAddToTableOpen, setIsModalAddToTableOpen] = useState<IModalAddToTableOpen>(
    {} as IModalAddToTableOpen
  );

  const [modalActionPayment, setModalActionPayment] = useState(
    {} as { isOpen: boolean; modal: number }
  );

  const { data: applicationData, isLoading, mutate } = useApplicationTable();
  const showModal = (adding_type: "invoices" | "payments") => {
    setIsModalAddToTableOpen({
      isOpen: true,
      adding: adding_type
    });
  };

  const handleCancel = () => {
    setIsModalAddToTableOpen({
      isOpen: false
    });
  };

  const handleAdd = async (adding_type: "invoices" | "payments", selectedIds: number[]) => {
    // Handle adding selected
    try {
      await addItemsToTable(projectId, clientId, adding_type, selectedIds);

      showMessage("success", "Se han agregado los elementos correctamente");
      setIsModalAddToTableOpen({
        isOpen: false
      });
      mutate();
    } catch (error) {
      showMessage("error", "Ha ocurrido un error al agregar los elementos");
    }
  };

  const dataForCollapse = useMemo(() => {
    const invoices = {
      statusName: "facturas",
      color: "#FF7A00",
      statusId: 1,
      itemsList: applicationData?.invoices,
      total: applicationData?.summary.total_invoices,
      count: applicationData?.invoices.length
    };

    const payments = {
      statusName: "pagos",
      color: "#0085FF",
      statusId: 2,
      itemsList: applicationData?.payments,
      total: applicationData?.summary.total_payments,
      count: applicationData?.payments.length
    };

    const discounts = {
      statusName: "ajustes",
      color: "#E53261",
      statusId: 3,
      itemsList: applicationData?.discounts,
      total: applicationData?.summary.total_discounts,
      count: applicationData?.discounts.length
    };

    return [invoices, payments, discounts];
  }, [applicationData]);

  return (
    <>
      <ModalResultAppy
        invoices={applicationData?.summary.total_invoices}
        desconts={applicationData?.summary.total_discounts}
        payments={applicationData?.summary.total_payments}
        total={applicationData?.summary.total_balance}
      />
      <div className="applyContainerTab">
        <Flex justify="space-between" className="accountingAdjustmentsTab__header">
          <Flex gap={"0.5rem"}>
            <UiSearchInput
              className="search"
              placeholder="Buscar"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </Flex>
          <Button
            type="primary"
            className="availableAdjustments"
            onClick={() => console.log("click ajustes disponibles")}
          >
            Guardar
          </Button>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ height: "3rem" }}>
            <Spin />
          </Flex>
        ) : (
          <Collapse
            items={dataForCollapse?.map((section) => ({
              key: section.statusId,
              label: (
                <Flex>
                  <LabelCollapse
                    status={section.statusName}
                    color={section.color}
                    total={section.total}
                    quantity={section.count}
                  />

                  <Flex
                    className="buttonActionApply"
                    onClick={() => {
                      if (section.statusName === "facturas") {
                        showModal("invoices");
                      }
                      if (section.statusName === "pagos") {
                        showModal("payments");
                      }
                      if (section.statusName === "ajustes") {
                        setModalActionPayment(
                          modalActionPayment.isOpen
                            ? { isOpen: false, modal: 0 }
                            : { isOpen: true, modal: 0 }
                        );
                      }
                    }}
                  >
                    <Plus />
                    <h5 className="">Agregar {`${section.statusName}`}</h5>
                  </Flex>
                </Flex>
              ),
              children: (
                <div>
                  {section.statusName === "facturas" && <InvoiceTable data={section.itemsList} />}
                  {section.statusName === "pagos" && <PaymentsTable data={section.itemsList} />}
                  {section.statusName === "ajustes" && <DiscountTable data={section.itemsList} />}
                </div>
              )
            }))}
          />
        )}
      </div>
      <ModalAddToTables
        onCancel={handleCancel}
        onAdd={handleAdd}
        isModalAddToTableOpen={isModalAddToTableOpen}
      />
      <ModalSelectAjustements
        isOpen={modalActionPayment && modalActionPayment.isOpen && modalActionPayment.modal === 0}
        onClose={() =>
          setModalActionPayment({
            isOpen: false,
            modal: 0
          })
        }
        setModalAction={(e: number) => {
          setModalActionPayment({
            isOpen: true,
            modal: e
          });
        }}
      />
      <ModalListAdjustments
        visible={modalActionPayment && modalActionPayment.isOpen && modalActionPayment.modal === 1}
        onCancel={() =>
          setModalActionPayment({
            isOpen: false,
            modal: 0
          })
        }
        onAdd={() => console.log("add")}
        setModalAction={(e: number) => {
          setModalActionPayment({
            isOpen: true,
            modal: e
          });
        }}
      />
      <ModalCreateAdjustment
        isOpen={modalActionPayment && modalActionPayment.isOpen && modalActionPayment.modal === 2}
        onCancel={() => setModalActionPayment({ isOpen: true, modal: 1 })}
        onOk={() => console.log("ssss")}
      />
    </>
  );
};

export default ApplyTab;
