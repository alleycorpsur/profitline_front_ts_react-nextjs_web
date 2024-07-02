import { FC } from "react";
import "./itemsActionsModal.scss";
import { Checkbox } from "antd";
import { formatMoney } from "@/utils/utils";
import { DividerVerticalModal } from "../DividerVertical/DividerVerticalModal";

interface ItemsActionsModalProps {
  onHeaderClick: () => void;
  type: number;
  item: {
    id: number;
    current_value: number;
    selected: boolean;
    motive_name?: string | undefined;
    percentage?: number | null;
    intialAmount?: number;
  };
}

const ItemsActionsModal: FC<ItemsActionsModalProps> = ({ onHeaderClick, item, type }) => {
  return (
    <div className="item">
      <div className="head">
        <Checkbox onChange={() => onHeaderClick()} checked={item.selected} />
        <DividerVerticalModal type={type} />
        <div className={"texts"}>
          <div className={"mainText"}>
            <strong className={"name"}>
              {titleMap[type]}
              <span>{item.id}</span>
            </strong>
          </div>
          <div className={"label"}>{item.motive_name ?? "Volumen"}</div>
        </div>
        <div className={"mainValues"}>
          <div className={"value"}>{formatMoney(item.current_value.toString())}</div>
          <div className={"subValue"}>
            {item.percentage
              ? `${item.percentage}%`
              : formatMoney(item.intialAmount?.toString() ?? "")}
          </div>
        </div>
      </div>
    </div>
  );
};

const titleMap: Record<number, string> = {
  1: "Nota débito",
  2: "Nota crédito",
  3: "Descuento"
};

export default ItemsActionsModal;
