import React, { useState, useMemo, useEffect } from "react";
import { Modal, Checkbox, Spin, message, Flex } from "antd";
import "./modalAddInvoice.scss";
import ItemsActionsModalInvoice from "@/components/atoms/ItemsModalInvoice/ItemsActionsModalInvoice";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CopySimple } from "phosphor-react";
import UiSearchInputLong from "@/components/ui/search-input-long";

interface Invoice {
  id: number;
  current_value: number;
  selected: boolean;
  date: string;
}

interface ModalAddInvoiceProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: () => void;
}

const ModalAddInvoice: React.FC<ModalAddInvoiceProps> = ({ visible, onCancel, onAdd }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 2357462, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 4678678, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 7865876, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 7865382, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 168376, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 781366, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 816576, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 765876, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 623876, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 123349, current_value: 16000000, selected: false, date: "19/04/2024" },
    { id: 786386, current_value: 12000000, selected: false, date: "19/04/2024" }
  ]);

  const [notFoundInvoices, setNotFoundInvoices] = useState<number[]>([]);
  const [adjustments, setAdjustments] = useState(15000000);

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const newInvoices = invoices.map((invoice) => ({ ...invoice, selected: e.target.checked }));
    setInvoices(newInvoices);
    notFoundInvoices.length && setNotFoundInvoices([]);
  };

  const handleInvoiceSelect = (id: number) => {
    const newInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, selected: !invoice.selected } : invoice
    );
    setInvoices(newInvoices);
  };

  const handlePasteInvoices = async () => {
    console.log("Pasting invoices");

    try {
      console.log("Reading text from clipboard");
      const text = await navigator.clipboard.readText();

      const pastedIds = text
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row !== "" && !isNaN(+row))
        .map(Number);

      console.log({ pastedIds });

      const foundIds = new Set(invoices.map((invoice) => invoice.id));
      const newNotFound: number[] = [];

      const updatedInvoices = invoices.map((invoice) => {
        if (pastedIds.includes(invoice.id)) {
          return { ...invoice, selected: true };
        }
        return invoice;
      });

      pastedIds.forEach((id) => {
        if (!foundIds.has(id)) {
          newNotFound.push(id);
        }
      });

      setInvoices(updatedInvoices);
      setNotFoundInvoices(newNotFound);

      console.log("Updated invoices:", updatedInvoices);
      console.log("Not found invoices:", newNotFound);
    } catch (err) {
      console.error("Error pasting invoices:", err);
      message.error("Error al pegar facturas. Por favor, inténtelo de nuevo.");
    }
  };

  const summary = useMemo(() => {
    const selectedInvoices = invoices.filter((invoice) => invoice.selected);
    const total = selectedInvoices.reduce((sum, invoice) => sum + invoice.current_value, 0);
    const pending = total - adjustments;
    return { total, adjustments, pending, count: selectedInvoices.length };
  }, [invoices, adjustments]);

  const isLoading = false;

  useEffect(() => {
    return () => {
      setNotFoundInvoices([]);
    };
  }, []);

  return (
    <Modal
      title="Agregar factura"
      visible={visible}
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
        <Checkbox onChange={handleSelectAll}>Seleccionar todo</Checkbox>
      </div>
      <div className="invoices-list">
        {invoices.map((invoice, index) => (
          <ItemsActionsModalInvoice
            key={invoice.id}
            onHeaderClick={() => handleInvoiceSelect(invoice.id)}
            type={index === 0 ? 1 : 0}
            item={invoice}
          />
        ))}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="button__action__text button__action__text__white"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`button__action__text ${!isLoading ? "button__action__text__green" : ""}`}
          onClick={onAdd}
        >
          {isLoading ? <Spin size="small" /> : "Agregar factura"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalAddInvoice;
