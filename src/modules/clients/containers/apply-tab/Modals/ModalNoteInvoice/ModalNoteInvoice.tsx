import React, { useState } from "react";
import { Modal, Spin } from "antd";
import "./ModalNoteInvoice.scss";
import { ArrowLeft } from "phosphor-react";
import UiSearchInputLong from "@/components/ui/search-input-long";
import ItemsActionsModal from "@/components/atoms/ItemsModal/ItemsActionsModal";

interface Adjustment {
  id: number;
  current_value: number;
  selected: boolean;
  motive_name: string;
  intialAmount: number;
  type: number;
}

interface ModalNoteInvoiceProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: () => void;
}

const ModalNoteInvoice: React.FC<ModalNoteInvoiceProps> = ({ visible, onCancel, onAdd }) => {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    {
      id: 12345,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 12345,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 1
    },
    {
      id: 12345,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 12345,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 12345,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    }
  ]);

  const handleAdjustmentSelect = (id: number) => {
    const newAdjustments = adjustments.map((adjustment) =>
      adjustment.id === id ? { ...adjustment, selected: !adjustment.selected } : adjustment
    );
    setAdjustments(newAdjustments);
  };

  const isLoading = false;

  return (
    <Modal
      title={
        <div className="modal-title">
          <ArrowLeft className="back-arrow" onClick={onCancel} />
          <span>Agregar ajuste</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="modal-note-invoice"
    >
      <h2 className="modal-subtitle">Selecciona los ajustes a aplicar</h2>
      <div className="search-container">
        <UiSearchInputLong placeholder="Buscar" className={"custom-input"} />
      </div>
      <div className="adjustments-list">
        {adjustments.map((adjustment) => (
          <ItemsActionsModal
            key={adjustment.id}
            onHeaderClick={() => handleAdjustmentSelect(adjustment.id)}
            type={adjustment.type}
            item={adjustment}
          />
        ))}
      </div>
      <div className="create-adjustment">
        <button className="create-adjustment-btn">+ Crear ajuste</button>
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
          {isLoading ? <Spin size="small" /> : "Agregar"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalNoteInvoice;
