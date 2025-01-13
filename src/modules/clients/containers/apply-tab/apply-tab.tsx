import React, { useCallback, useMemo, useState } from "react";
import { DotsThree, Plus } from "phosphor-react";
import { Button, Flex, Spin } from "antd";

import { useApplicationTable } from "@/hooks/useApplicationTable";
import Collapse from "@/components/ui/collapse";
import LabelCollapse from "@/components/ui/label-collapse";
import { useParams } from "next/navigation";

import { useAppStore } from "@/lib/store/store";
import { extractSingleParam } from "@/utils/utils";
import { addItemsToTable, removeItemsFromTable } from "@/services/applyTabClients/applyTabClients";
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
import ModalEditRow from "./Modals/ModalEditRow/ModalEditRow";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

import "./apply-tab.scss";

interface ISelectedRowKeys {
  invoices: React.Key[];
  payments: React.Key[];
  discounts: React.Key[];
}

export interface IModalAddToTableOpen {
  isOpen: boolean;
  adding?: "invoices" | "payments";
}

export interface IModalAdjustmentsState {
  isOpen: boolean;
  modal: number;
  adjustmentType?: "global" | "byInvoice";
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

  const [modalAdjustmentsState, setModalAdjustmentsState] = useState({} as IModalAdjustmentsState);
  const [editingRow, setEditingRow] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<ISelectedRowKeys>({
    invoices: [],
    payments: [],
    discounts: []
  });
  const [selectedRows, setSelectedRows] = useState<IApplyTabRecord[]>();

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

  const handleAdd = async (
    adding_type: "invoices" | "payments" | "discounts",
    selectedIds: number[]
  ) => {
    // Handle adding selected
    try {
      await addItemsToTable(projectId, clientId, adding_type, selectedIds);

      showMessage("success", "Se han agregado los elementos correctamente");
      if (adding_type !== "discounts") {
        setIsModalAddToTableOpen({
          isOpen: false
        });
      } else {
        setModalAdjustmentsState({
          isOpen: false,
          modal: 0,
          adjustmentType: undefined
        });
      }

      mutate();
    } catch (error) {
      showMessage("error", "Ha ocurrido un error al agregar los elementos");
    }
  };

  const handleRemoveRow = async (row_id: number) => {
    // Handle removing selected
    try {
      await removeItemsFromTable(row_id);
      showMessage("success", `Se ha eliminado el elemento correctamente ${row_id}`);
      mutate();
    } catch (error) {
      showMessage("error", "Ha ocurrido un error al eliminar el elemento");
    }
  };

  const handleEditRow = (row_id: number) => {
    console.info("Edit row", row_id);
    setEditingRow(true);
  };

  const handleSelectChange = useCallback(
    (tableKey: keyof ISelectedRowKeys, newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(() => {
        const updatedSelectedRowKeys: ISelectedRowKeys = {
          payments: [],
          invoices: [],
          discounts: []
        };
        updatedSelectedRowKeys[tableKey] = newSelectedRowKeys;
        return updatedSelectedRowKeys;
      });
    },
    []
  );

  const rowSelection = (tableKey: keyof ISelectedRowKeys) => ({
    selectedRowKeys: selectedRowKeys[tableKey],
    onChange: (newSelectedRowKeys: React.Key[], newSelectedRows: any) => {
      setSelectedRows(newSelectedRows);
      return handleSelectChange(tableKey, newSelectedRowKeys);
    }
  });

  const handlePrintSelectedRows = () => {
    // I leave this here for future use
    for (const key in selectedRowKeys) {
      if (selectedRowKeys.hasOwnProperty(key)) {
        const typedKey = key as keyof ISelectedRowKeys; // Type assertion to avoid TS error
        const selectedRows = selectedRowKeys[typedKey];
        if (selectedRows.length > 0) {
          console.info(`Selected ${key}:`, selectedRows);
        }
      }
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
            <Button
              className={"button__actions"}
              size="large"
              icon={<DotsThree size={"1.5rem"} />}
              onClick={handlePrintSelectedRows}
            >
              Generar acción
            </Button>
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
                        setModalAdjustmentsState(
                          modalAdjustmentsState.isOpen
                            ? { isOpen: false, modal: 1 }
                            : { isOpen: true, modal: 1 }
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
                  {section.statusName === "facturas" && (
                    <InvoiceTable
                      data={section.itemsList}
                      handleDeleteRow={handleRemoveRow}
                      handleEditRow={handleEditRow}
                      rowSelection={rowSelection("invoices")}
                    />
                  )}
                  {section.statusName === "pagos" && (
                    <PaymentsTable
                      data={section.itemsList}
                      handleDeleteRow={handleRemoveRow}
                      handleEditRow={handleEditRow}
                      rowSelection={rowSelection("payments")}
                    />
                  )}
                  {section.statusName === "ajustes" && (
                    <DiscountTable
                      data={section.itemsList}
                      handleDeleteRow={handleRemoveRow}
                      handleEditRow={handleEditRow}
                      rowSelection={rowSelection("discounts")}
                    />
                  )}
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
        isOpen={
          modalAdjustmentsState && modalAdjustmentsState.isOpen && modalAdjustmentsState.modal === 1
        }
        onClose={() =>
          setModalAdjustmentsState({
            isOpen: false,
            modal: 1
          })
        }
        setModalAction={(e: number, adjustmentType: "global" | "byInvoice") => {
          setModalAdjustmentsState({
            isOpen: true,
            modal: e,
            adjustmentType
          });
        }}
      />
      <ModalListAdjustments
        visible={
          modalAdjustmentsState && modalAdjustmentsState.isOpen && modalAdjustmentsState.modal === 2
        }
        onCancel={() =>
          setModalAdjustmentsState({
            isOpen: true,
            modal: 1,
            adjustmentType: undefined
          })
        }
        setModalAction={(e: number) => {
          setModalAdjustmentsState({
            isOpen: true,
            modal: e
          });
        }}
        addGlobalAdjustment={handleAdd}
        modalAdjustmentsState={modalAdjustmentsState}
        selectedInvoices={selectedRows}
      />
      <ModalCreateAdjustment
        isOpen={
          modalAdjustmentsState && modalAdjustmentsState.isOpen && modalAdjustmentsState.modal === 3
        }
        onCancel={() => setModalAdjustmentsState({ isOpen: true, modal: 2 })}
      />
      <ModalEditRow visible={editingRow} onCancel={() => setEditingRow(false)} />
    </>
  );
};

export default ApplyTab;
