import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Modal, Spin } from "antd";
import { CaretLeft, Plus } from "phosphor-react";

import { IFinancialDiscount, useAcountingAdjustment } from "@/hooks/useAcountingAdjustment";
import { useAppStore } from "@/lib/store/store";
import { extractSingleParam, formatMoney } from "@/utils/utils";

import UiSearchInputLong from "@/components/ui/search-input-long";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import CheckboxColoredValues from "@/components/ui/checkbox-colored-values/checkbox-colored-values";

import "./modalListAdjustments.scss";

interface ModalListAdjustmentsProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: () => void;
  // eslint-disable-next-line no-unused-vars
  setModalAction: (modalAction: number) => void;
}

const ModalListAdjustments: React.FC<ModalListAdjustmentsProps> = ({
  visible,
  onCancel,
  onAdd,
  setModalAction
}) => {
  const params = useParams();
  const clientId = extractSingleParam(params.clientId) || "";
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [selectedRows, setSelectedRows] = useState<IFinancialDiscount[]>([]);

  const { data } = useAcountingAdjustment(clientId, projectId.toString(), 2);

  const handleCreateAdjustments = () => {
    setModalAction(2);
  };

  const handleSelectOne = (checked: boolean, row: IFinancialDiscount) => {
    setSelectedRows((prevSelectedRows) =>
      checked
        ? [...prevSelectedRows, row]
        : prevSelectedRows.filter((selected) => selected.id !== row.id)
    );
  };

  const isLoading = false;

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
        <UiSearchInputLong placeholder="Buscar" className={"custom-input"} />
      </div>
      <div className="adjustments-list">
        {data?.[0].financial_discounts?.map((row) => (
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
                  <h4 className="adjustments-list__title">Nota crédito {row.id}</h4>
                  <p className="adjustments-list__subtitle">Volumen</p>
                </div>

                <div>
                  <h3 className="adjustments-list__amount">{formatMoney(row.current_value)}</h3>
                  <p className="adjustments-list__subtitle">{formatMoney(row.initial_value)}</p>
                </div>
              </Flex>
            }
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

export default ModalListAdjustments;
