import React from "react";
import { InputNumber } from "antd";
import styles from "./InputCurrency.module.scss";

interface InputCurrencyProps {
  style?: React.CSSProperties;
  value: number;
  onChange: (value: number) => void;
}

const InputCurrency = (props: InputCurrencyProps) => {
  const { value, onChange, style } = props;

  const handleChange = (value: number | null) => {
    if (value !== null && !isNaN(value)) {
      onChange(value);
    }
  };
  const handleBlur = () => {
    if (value === null || isNaN(value)) {
      onChange(0); // Asegura que el valor por defecto sea 0 si el campo está vacío
    }
  };
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "10px", fontSize: "16px", zIndex: 1 }}>$</span>
      <InputNumber<number>
        {...{ value, onChange }}
        style={{
          width: "100%",
          fontFamily: "Courier New, monospace", // Fuente monoespaciada
          ...style
        }}
        className={styles.numericInput}
        controls={false}
        maxLength={16}
        min={0}
        precision={2} // Permite hasta 2 decimales
        // formatter={
        //   (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Mantén el formato para decimales
        // }
        formatter={(value) =>
          `${value || 0}` // Asegura que siempre se muestre $ 0 cuando el valor sea vacío
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={
          (value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number // Convierte el texto a número
        }
        onChange={(value) => handleChange(value as number)}
        onBlur={handleBlur}
        value={value}
      />
    </div>
  );
};
export default InputCurrency;
