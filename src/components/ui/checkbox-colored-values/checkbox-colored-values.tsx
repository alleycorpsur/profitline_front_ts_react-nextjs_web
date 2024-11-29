import React, { FC } from "react";
import { Checkbox } from "antd";

import { DividerVerticalModal } from "@/components/atoms/DividerVertical/DividerVerticalModal";

import "./checkbox-colored-values.scss";

interface CheckboxColoredValuesProps extends React.ComponentProps<typeof Checkbox> {
  color?: string; // Custom color for the checkbox
  onChangeCheckbox: (e: any) => void;
  checked: boolean;
  content?: React.ReactNode;
  customStyles?: React.CSSProperties;
  customStyleDivider?: React.CSSProperties;
}

const CheckboxColoredValues: FC<CheckboxColoredValuesProps> = ({
  color = "#1890ff",
  onChangeCheckbox,
  checked,
  content,
  customStyles,
  customStyleDivider,
  ...restProps
}) => {
  return (
    <div className="checkboxColoredValues" style={customStyles}>
      <div className="head">
        <Checkbox
          className="customCheckbox"
          checked={checked}
          onChange={onChangeCheckbox}
          {...restProps}
        />
        <DividerVerticalModal color={color} customStyles={customStyleDivider} />
        {content}
      </div>
    </div>
  );
};

export default CheckboxColoredValues;
