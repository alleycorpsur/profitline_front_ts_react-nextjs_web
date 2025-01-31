import { FC } from "react";
import { Collapse, CollapsePanelProps } from "antd";
import "./collapse.scss";

interface ItemCollapse {
  key?: any;
  label?: CollapsePanelProps["header"];
  children?: CollapsePanelProps["children"];
}

interface CollapseProps {
  items: ItemCollapse[] | undefined;
  accordion?: boolean;
  stickyLabel?: boolean;
  labelStickyOffset?: string;
}

const GenericCollapse: FC<CollapseProps> = ({
  items,
  accordion,
  stickyLabel,
  labelStickyOffset
}) => {
  return (
    <Collapse
      style={
        {
          "--sticky-offset": `${labelStickyOffset ? labelStickyOffset : "8.3rem"}`
        } as React.CSSProperties
      }
      className={`genericCollapse ${stickyLabel ? "sticky" : ""}`}
      ghost
      items={items}
      accordion={accordion}
    />
  );
};

export default GenericCollapse;
