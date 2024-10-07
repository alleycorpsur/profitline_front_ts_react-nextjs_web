import React, { useState } from "react";
import { Modal, Button, Checkbox, Spin, Flex } from "antd";

import "./ModalAddInvoice.scss";
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
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 20000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 28000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 12000000, selected: false, date: "19/04/2024" },
    { id: 12345, current_value: 16000000, selected: false, date: "19/04/2024" }
  ]);

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const newInvoices = invoices.map((invoice) => ({ ...invoice, selected: e.target.checked }));
    setInvoices(newInvoices);
  };

  const handleInvoiceSelect = (id: number) => {
    const newInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, selected: !invoice.selected } : invoice
    );
    setInvoices(newInvoices);
  };
  const isLoading = false;
  return (
    <Modal
      title="Agregar factura"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      height={"calc(80vh - 20px)"}
      className="modal-add-invoice"
    >
      <div className="search-container">
        <UiSearchInputLong placeholder="Buscar" className={"custom-input"} />
      </div>
      <div className="container-paste-invoice">
        <div className="excel-button-container">
          <CopySimple size={18} />
          Pegar desde excel
        </div>
      </div>
      <div className="select-all">
        <Checkbox onChange={handleSelectAll}>Seleccionar todo</Checkbox>
      </div>
      <div className="invoices-list">
        {invoices.map((invoice, index) => (
          <ItemsActionsModalInvoice
            key={index}
            onHeaderClick={() => handleInvoiceSelect(invoice.id)}
            type={index === 0 ? 1 : 2}
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
          className={`button__action__text ${false ? "button__action__text__green" : ""}`}
          onClick={() => onAdd()}
        >
          {isLoading ? <Spin size="small" /> : "Agregar factura"}
        </button>
      </div>
      {/* <div className="modal-footer">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" onClick={onAdd}>
          Agregar factura
        </Button>
      </div> */}
    </Modal>
  );
};

export default ModalAddInvoice;
