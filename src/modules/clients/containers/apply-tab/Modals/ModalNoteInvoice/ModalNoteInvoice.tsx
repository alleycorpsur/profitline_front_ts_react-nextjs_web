import React, { useState } from "react";
import { Modal, Spin } from "antd";
import "./modalNoteInvoice.scss";
import { CaretLeft, Plus } from "phosphor-react";
import UiSearchInputLong from "@/components/ui/search-input-long";
import ItemsActionsModal from "@/components/atoms/ItemsModal/ItemsActionsModal";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";

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
      id: 1,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 2,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 1
    },
    {
      id: 3,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 4,
      current_value: 12000000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 15000000,
      type: 2
    },
    {
      id: 5,
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

  const handleCreateAdjustments = () => {
    console.log("Create adjustments");
  };

  const isLoading = false;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="modal-note-invoice"
    >
      <div onClick={onCancel} className="header">
        <CaretLeft size={24} onClick={onCancel} />
        <h2>Agregar ajuste</h2>
      </div>
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
        <button onClick={handleCreateAdjustments} className="create-adjustment-btn">
          <Plus size={20} />
          Crear ajuste
        </button>
      </div>

      <div className="modal-footer">
        <SecondaryButton fullWidth onClick={onCancel}>
          Cancelar
        </SecondaryButton>
        <PrincipalButton fullWidth onClick={onAdd}>
          {isLoading ? <Spin size="small" /> : "Agregar"}
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalNoteInvoice;
