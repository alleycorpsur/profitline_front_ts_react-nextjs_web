import React from "react";
import { DotsThree } from "phosphor-react";
import styles from "./button.module.scss";

interface GenerateActionButtonProps {
  label?: string; // Texto del botón
  onClick: () => void; // Acción a ejecutar al hacer clic
  icon?: React.ReactNode; // Icono opcional
  size?: "small" | "middle" | "large"; // Tamaño del botón
  style?: React.CSSProperties; // Estilos personalizados
}

export const GenerateActionButton: React.FC<GenerateActionButtonProps> = ({
  label = "Generar acción",
  onClick,
  icon = <DotsThree size="1.5rem" />, // Icono predeterminado
  style // Estilos personalizados pasados por props
}) => {
  return (
    <button
      className={styles.buttonGenerateAction}
      style={{
        ...style // Permite sobrescribir cualquier estilo definido en el SCSS
      }}
      onClick={onClick}
    >
      {icon && icon}
      {label}
    </button>
  );
};
