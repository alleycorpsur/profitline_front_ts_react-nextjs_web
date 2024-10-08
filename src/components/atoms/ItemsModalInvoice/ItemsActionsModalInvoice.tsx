import { FC } from "react";
import "./itemsActionsModalInvoiceStyle.scss";
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
    date: string;
  };
}

const ItemsActionsModalInvoice: FC<ItemsActionsModalProps> = ({ onHeaderClick, item, type }) => {
  return (
    <div className="item">
      <div className="head">
        <Checkbox onChange={() => onHeaderClick()} checked={item.selected} />
        <DividerVerticalModal color={type === 1 ? "#CAE234" : "#9747FF"} />
        <div className={"texts"}>
          <div className={"mainText"}>
            <strong className={"name"}>
              <span> Factura {item.id}</span>
            </strong>
          </div>
          <div className={"label"}>{item.date ?? ""}</div>
        </div>
        <div className={"mainValues"}>
          <div className={"value"}>{formatMoney(item.current_value.toString())}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemsActionsModalInvoice;
