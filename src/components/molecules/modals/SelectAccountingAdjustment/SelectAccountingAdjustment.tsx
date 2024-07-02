import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./selectAccountingAdjustment.scss";
import { Flex, Spin } from "antd";
import { ISelectedAccountingAdjustment } from "../ModalActionDiscountCredit/ModalActionDiscountCredit";
import ItemsActionsModal from "@/components/atoms/ItemsModal/ItemsActionsModal";
import { Plus } from "phosphor-react";
import { useAcountingAdjustment } from "@/hooks/useAcountingAdjustment";

interface Props {
  type: number;
  selectedRows: ISelectedAccountingAdjustment[];
  setSelectedRows: Dispatch<SetStateAction<ISelectedAccountingAdjustment[]>>;
  onClose: () => void;
  setCurrentView: Dispatch<SetStateAction<string>>;
}
interface ItemsSelected {
  id: number;
  current_value: number;
  selected: boolean;
  motive_name: string;
  percentage?: number | null;
  intialAmount?: number;
}

export const SelectAccountingAdjustment = ({
  type,
  selectedRows,
  onClose,
  setCurrentView,
  setSelectedRows
}: Props) => {
  const { data, isLoading } = useAcountingAdjustment(98765232, type);
  const [dateSelect, setDateSelect] = useState<ItemsSelected[]>([]);
  const handleCheckClick = (item: ISelectedAccountingAdjustment) => {
    const isExist = selectedRows.some((row) => row.id === item.id);
    console.log(isExist);

    if (isExist) setSelectedRows((prevRows) => prevRows.filter((row) => row.id !== item.id));
    else setSelectedRows((prevRows) => [...prevRows, item]);
  };

  useEffect(() => {
    if (data) {
      setDateSelect(
        data
          .map((item) => ({
            id: item.id,
            current_value: item.current_value,
            selected: selectedRows.some((row) => row.id === item.id),
            motive_name: item.motive_name,
            percentage: item.percentage,
            intialAmount: item.initial_value
          }))
          .flat()
      );
    }
  }, [data, selectedRows]);

  return (
    <div className="modalContent">
      <p className="subTitleModalAction">{subtitleMap[type || 1]}</p>
      <div className="modalContentScroll">
        {isLoading ? (
          <Spin />
        ) : (
          dateSelect.map((item, index) => (
            <ItemsActionsModal
              key={index}
              item={item}
              type={type || 1}
              onHeaderClick={() => handleCheckClick(item)}
            />
          ))
        )}
      </div>
      <button
        type="button"
        className="button__create__action"
        onClick={() => setCurrentView("create")}
      >
        <Plus /> Crear {typeMap[type || 1]}
      </button>
      <Flex gap="8px">
        <button
          type="button"
          className="button__action__text button__action__text__white"
          onClick={() => onClose()}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`button__action__text ${selectedRows.length > 0 ? "button__action__text__green" : ""}`}
          onClick={() => {
            selectedRows.length > 0 && setCurrentView("apply");
          }}
        >
          Continuar
        </button>
      </Flex>
    </div>
  );
};

const typeMap: Record<number, string> = {
  1: "débito",
  2: "crédito",
  3: "descuento"
};

const subtitleMap: Record<number, string> = {
  1: "Selecciona la(s) nota(s) débito a aplicar",
  2: "Selecciona la(s) nota(s) crédito a aplicar",
  3: "Selecciona los descuento a aplicar"
};
