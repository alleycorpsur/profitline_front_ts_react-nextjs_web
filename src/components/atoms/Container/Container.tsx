import { Flex } from "antd";
import React, { CSSProperties, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  style?: CSSProperties; // Permite personalizar estilos si es necesario
}

const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const defaultStyle: CSSProperties = {
    backgroundColor: "#fff", // Fondo blanco
    padding: "2rem", // Padding de 2rem
    borderRadius: "8px", // Opcional: esquinas redondeadas para un diseño moderno
    height: "100%" // Altura del contenedor
  };

  return (
    <Flex vertical style={{ ...defaultStyle, ...style }}>
      {children}
    </Flex>
  );
};

export default Container;
