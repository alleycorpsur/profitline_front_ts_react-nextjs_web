import React, { useState, useMemo, useEffect } from "react";
import { Modal, Checkbox, Spin, message, Flex, Pagination } from "antd";
import { CopySimple } from "phosphor-react";

import { useInvoices } from "@/hooks/useInvoices";
import { useClientsPayments } from "@/hooks/useClientsPayments";
import { formatDate, formatMoney } from "@/utils/utils";

import UiSearchInputLong from "@/components/ui/search-input-long";
import { IModalAddToTableOpen } from "../../apply-tab";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import CheckboxColoredValues from "@/components/ui/checkbox-colored-values/checkbox-colored-values";

import { IClientPayment } from "@/types/clientPayments/IClientPayments";
import { IInvoice } from "@/types/invoices/IInvoices";

import "./modalAddToTables.scss";
interface ModalAddToTablesProps {
  onCancel: () => void;
  onAdd: () => void;
  isModalAddToTableOpen: IModalAddToTableOpen;
}

const ModalAddToTables: React.FC<ModalAddToTablesProps> = ({
  onCancel,
  onAdd,
  isModalAddToTableOpen
}) => {
  const [rows, setRows] = useState<(IInvoice | IClientPayment)[]>([]);
  const [selectedRows, setSelectedRows] = useState<(IInvoice | IClientPayment)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const { data: invoicesByState } = useInvoices({});
  const allInvoices = invoicesByState?.map((data) => data.invoices).flat();

  const { data: paymentsByState } = useClientsPayments();
  const allPayments = paymentsByState?.map((data) => data.payments).flat();

  useEffect(() => {
    if (isModalAddToTableOpen.adding === "invoices" && allInvoices) {
      setRows(allInvoices);
    } else if (isModalAddToTableOpen.adding === "payments" && allPayments) {
      setRows(allPayments);
    }

    return () => {
      setSelectedRows([]);
      setRows([]);
    };
  }, [isModalAddToTableOpen.adding]);

  const [notFoundInvoices, setNotFoundInvoices] = useState<number[]>([]);
  const [adjustments, setAdjustments] = useState(15000000);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectOne = (checked: boolean, row: IClientPayment | IInvoice) => {
    setSelectedRows((prevSelectedRows) =>
      checked
        ? [...(prevSelectedRows as (IInvoice | IClientPayment)[]), row]
        : (prevSelectedRows as (IInvoice | IClientPayment)[]).filter(
            (selected) => selected.id !== row.id
          )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return rows.slice(startIndex, endIndex);
  }, [rows, currentPage]);

  const handlePasteInvoices = async () => {};

  const summary = useMemo(() => {
    const total = selectedRows.reduce((sum, row) => sum + row.current_value, 0);
    const pending = total - adjustments;
    return { total, adjustments, pending, count: selectedRows.length };
  }, [selectedRows, adjustments]);

  const isLoading = false;

  useEffect(() => {
    return () => {
      setNotFoundInvoices([]);
    };
  }, []);

  return (
    <Modal
      title={`Agregar ${isModalAddToTableOpen.adding === "invoices" ? "facturas" : "pagos"}`}
      open={isModalAddToTableOpen.isOpen}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="modal-add-invoice"
    >
      {summary.count > 0 && (
        <div className="summary-section">
          <div className="summary-item">
            <span>Total ({summary.count})</span>
            <span>${summary.total.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span>Ajustes</span>
            <span>${summary.adjustments.toLocaleString()}</span>
          </div>
          <div className="summary-item pending">
            <span>Pendiente</span>
            <span>${summary.pending.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="search-container">
        <UiSearchInputLong placeholder="Buscar" className={"custom-input"} />
      </div>
      {notFoundInvoices.length > 0 && (
        <div className="not-found-invoices">
          <Flex justify="space-between">
            <div>Facturas no encontradas</div>
            <div
              className="excel-button-container"
              onClick={() => {
                navigator.clipboard.writeText(notFoundInvoices.join(", "));
                message.success("Valores copiados");
              }}
            >
              <CopySimple size={18} />
              Copiar valores
            </div>
          </Flex>

          <div className="buld-text-excel-not-found">
            <strong> {notFoundInvoices.join(", ")}</strong>
          </div>
        </div>
      )}
      {!notFoundInvoices.length && (
        <div className="container-paste-invoice">
          <div className="excel-button-container" onClick={handlePasteInvoices}>
            <CopySimple size={18} />
            Pegar desde excel
          </div>
        </div>
      )}

      <div className="select-all">
        <Checkbox onChange={(e) => handleSelectAll(e.target.checked)}>Seleccionar todo</Checkbox>
      </div>
      <div className="invoices-list">
        {paginatedRows.map((row) => (
          <CheckboxColoredValues
            customStyles={{ height: "76px" }}
            customStyleDivider={{ width: "6px", height: "44px", alignSelf: "center" }}
            key={row.id}
            onChangeCheckbox={(e) => {
              handleSelectOne(e.target.checked, row);
            }}
            checked={selectedRows.some((selected) => selected.id === row.id)}
            content={
              <Flex style={{ width: "100%" }} justify="space-between">
                <div>
                  <h4>
                    {isModalAddToTableOpen.adding === "invoices" ? "Factura" : "Pago"} {row.id}
                  </h4>
                  <p>{formatDate(row.updated_at)}</p>
                </div>
                <h3>{formatMoney(row.current_value)}</h3>
              </Flex>
            }
          />
        ))}
      </div>
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={rows.length}
        pageSize={ITEMS_PER_PAGE}
        style={{ textAlign: "right", margin: ".5rem 0" }}
      />

      <div className="modal-footer">
        <SecondaryButton fullWidth onClick={onCancel}>
          Cancelar
        </SecondaryButton>

        <PrincipalButton
          fullWidth
          // onClick={onAdd}
          onClick={() => console.log("Agregar ", selectedRows)}
        >
          {isLoading ? (
            <Spin size="small" />
          ) : (
            `Agregar ${isModalAddToTableOpen.adding === "invoices" ? "facturas" : "pagos"}`
          )}
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalAddToTables;
