// import React from "react";
import styles from "./InputNumber.module.scss";

import { Input } from "antd";

// interface InputCurrencyProps {
//   style?: React.CSSProperties;
//   value: number;
//   onChange: (value: number) => void;
// }

// const InputCurrency: React.FC<InputCurrencyProps> = ({ value, onChange, style }) => {
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputValue = e.target.value;
//     console.log("inputValue", inputValue);
//     // Permitir solo números y un único punto decimal
//     if (/^\d*\.?\d*$/.test(inputValue)) {
//       const numericValue = parseFloat(inputValue) || 0; // Convierte a número, por defecto 0 si está vacío
//       onChange(numericValue);
//     }
//   };

//   const handleBlur = () => {
//     if (isNaN(value)) {
//       onChange(0); // Asegura que el valor por defecto sea 0 si el campo está vacío o contiene valores inválidos
//     }
//   };

//   return (
//     <input
//       type="text"
//       value={value.toFixed(2)} // Asegura que siempre se muestren 2 decimales
//       onChange={handleInputChange}
//       onBlur={handleBlur}
//       style={{
//         width: "100%",
//         textAlign: "right", // Alineación a la derecha
//         fontFamily: "Courier New, monospace", // Fuente monoespaciada
//         ...style
//       }}
//       className={styles.inputCurrency}
//     />
//   );
// };

// export default InputCurrency;

export interface InputNumberProps {
  value: string;
  onChange: (value: string) => void;
}
const InputNumber = ({ value, onChange }: InputNumberProps) => {
  const formatNumber = (value: string): string => {
    if (!value) return "";
    else if (typeof value !== "string") value = String(value);
    const numStr = String(value).replace(/\D/g, "");
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string): string => {
    return value.replace(/\./g, "");
  };
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "10px", fontSize: "16px", zIndex: 1 }}>$</span>
      <Input
        value={formatNumber(value)}
        onChange={(e) => {
          const formattedValue = formatNumber(e.target.value);
          const numericValue = parseNumber(formattedValue);
          onChange(numericValue);
        }}
        style={{
          width: "100%",
          textAlign: "right", // Alineación a la derecha
          fontFamily: "Courier New, monospace" // Fuente monoespaciada
        }}
        className={styles.inputCurrency}
      />
    </div>
  );
};
export default InputNumber;
