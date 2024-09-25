import React from "react";

interface SimpleTagProps {
  text: string;
  colorTag: string;
  colorText: string;
  fontSize: string;
}

const SimpleTag: React.FC<SimpleTagProps> = ({ text, colorTag, colorText, fontSize }) => {
  return (
    <span
      style={{
        backgroundColor: colorTag,
        color: colorText,
        fontSize: fontSize,
        fontWeight: 500,
        borderRadius: "4px",
        padding: "0.125rem 0.25rem",
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </span>
  );
};

export default SimpleTag;
