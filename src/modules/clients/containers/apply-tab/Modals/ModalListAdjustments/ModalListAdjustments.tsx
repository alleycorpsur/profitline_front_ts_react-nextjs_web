import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Modal, Pagination, Spin } from "antd";
import { CaretLeft, Plus } from "phosphor-react";

import { IFinancialDiscount, useAcountingAdjustment } from "@/hooks/useAcountingAdjustment";
import { useAppStore } from "@/lib/store/store";
import { extractSingleParam, formatMoney } from "@/utils/utils";

import UiSearchInputLong from "@/components/ui/search-input-long";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import CheckboxColoredValues from "@/components/ui/checkbox-colored-values/checkbox-colored-values";

import { IModalAdjustmentsState } from "../../apply-tab";

import "./modalListAdjustments.scss";

interface ModalListAdjustmentsProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  setModalAction: (modalAction: number) => void;
  addGlobalAdjustment: (
    // eslint-disable-next-line no-unused-vars
    adding_type: "invoices" | "payments" | "discounts",
    // eslint-disable-next-line no-unused-vars
    selectedIds: number[]
  ) => Promise<void>;
  modalAdjustmentsState: IModalAdjustmentsState;
}

const ModalListAdjustments: React.FC<ModalListAdjustmentsProps> = ({
  visible,
  onCancel,
  setModalAction,
  addGlobalAdjustment,
  modalAdjustmentsState
}) => {
  const params = useParams();
  const clientId = extractSingleParam(params.clientId) || "";
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [selectedRows, setSelectedRows] = useState<IFinancialDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const { data, isLoading } = useAcountingAdjustment(clientId, projectId.toString(), 2);

  useEffect(() => {
    return () => {
      setSelectedRows([]);
    };
  }, [visible]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateAdjustments = () => {
    if (modalAdjustmentsState.adjustmentType === "global") {
      setModalAction(3);
    } else if (modalAdjustmentsState.adjustmentType === "byInvoice") {
      console.info("by invoice");
    }
  };

  const handleSelectOne = (checked: boolean, row: IFinancialDiscount) => {
    setSelectedRows((prevSelectedRows) =>
      checked
        ? [...prevSelectedRows, row]
        : prevSelectedRows.filter((selected) => selected.id !== row.id)
    );
  };

  const handleAddAdjustments = async () => {
    setLoading(true);
    if (modalAdjustmentsState.adjustmentType === "global") {
      await addGlobalAdjustment(
        "discounts",
        selectedRows.map((row) => row.id)
      );
    } else if (modalAdjustmentsState.adjustmentType === "byInvoice") {
      console.info("by invoice");
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    if (!data?.[0]?.financial_discounts) return [];
    return data?.[0].financial_discounts.filter((row) => row.id.toString().includes(searchQuery));
  }, [data, searchQuery]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData?.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="modal-list-adjustments"
    >
      <div onClick={onCancel} className="header">
        <CaretLeft size={24} onClick={onCancel} />
        <h2>Agregar ajuste</h2>
      </div>
      <h2 className="modal-subtitle">Selecciona los ajustes a aplicar</h2>
      <div className="search-container">
        <UiSearchInputLong
          placeholder="Buscar"
          className={"custom-input"}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <Flex justify="center" style={{ width: "100%", margin: "2rem 0" }}>
          <Spin />
        </Flex>
      ) : (
        <>
          <div className="adjustments-list">
            {paginatedRows?.map((row) => (
              <CheckboxColoredValues
                customStyles={{ height: "76px" }}
                customStyleDivider={{ width: "6px", height: "44px", alignSelf: "center" }}
                key={row.id}
                onChangeCheckbox={(e) => {
                  handleSelectOne(e.target.checked, row);
                }}
                checked={selectedRows.some((selected) => selected.id === row.id)}
                content={
                  <Flex style={{ width: "100%" }} justify="space-between" align="center">
                    <Flex vertical>
                      <h4 className="adjustments-list__title">Nota crédito {row.id}</h4>
                      <p className="adjustments-list__subtitle">Volumen</p>
                    </Flex>

                    <Flex vertical>
                      <h3 className="adjustments-list__amount">{formatMoney(row.current_value)}</h3>
                      <p className="adjustments-list__subvalue">{formatMoney(row.initial_value)}</p>
                    </Flex>
                  </Flex>
                }
              />
            ))}
          </div>
          <Pagination
            pageSize={ITEMS_PER_PAGE}
            current={currentPage}
            onChange={handlePageChange}
            total={filteredData?.length}
            showSizeChanger={false}
            style={{ textAlign: "right", margin: ".5rem 0" }}
          />
        </>
      )}
      <div className="create-adjustment">
        <button onClick={handleCreateAdjustments} className="create-adjustment-btn">
          <Plus size={20} />
          Crear ajuste
        </button>
      </div>

      <div className="modal-footer">
        <SecondaryButton fullWidth onClick={onCancel}>
          Cancelar
        </SecondaryButton>
        <PrincipalButton fullWidth onClick={handleAddAdjustments} loading={loading}>
          Agregar
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalListAdjustments;
