import React from "react";
import "./dividerModal.scss";

interface DividerProps {
  type?: number;
  color?: string;
  className?: string;
}

export const DividerVerticalModal: React.FC<DividerProps> = ({ type, color, className }) => {
  let backgroundColor;

  switch (type) {
    case 1:
      backgroundColor = "#00A3FF";
      break;
    case 2:
      backgroundColor = "#9747FF";
      break;
    case 3:
      backgroundColor = "#FF7A00";
      break;
    default:
      backgroundColor = "#00A3FF";
      break;
  }

  const finalClassName = `divides ${className || ""}`; 

  return <div className={finalClassName} style={{ backgroundColor: color || backgroundColor }} />;
};
