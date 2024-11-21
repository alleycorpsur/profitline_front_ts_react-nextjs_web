import React, { FC } from "react";
import { Checkbox } from "antd";

import { DividerVerticalModal } from "@/components/atoms/DividerVertical/DividerVerticalModal";

import "./checkbox-colored-values.scss";

interface CheckboxColoredValuesProps extends React.ComponentProps<typeof Checkbox> {
  color?: string; // Custom color for the checkbox
  onChangeCheckbox: (e: any) => void;
  checked: boolean;
  content?: React.ReactNode;
}

const CheckboxColoredValues: FC<CheckboxColoredValuesProps> = ({
  color = "#1890ff", // Default Ant Design primary color
  onChangeCheckbox,
  checked,
  content,
  ...restProps
}) => {
  return (
    <div className="checkboxColoredValues">
      <div className="head">
        <Checkbox
          className="customCheckbox"
          style={{ color }}
          checked={checked}
          onChange={onChangeCheckbox}
          {...restProps}
        />
        <DividerVerticalModal />
        {content}
      </div>
    </div>
  );
};

export default CheckboxColoredValues;
