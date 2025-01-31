import React from "react";
import ColumnText from "../../ColumnText/ColumnText";
import { Files } from "phosphor-react";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";

interface ExpirationSectionProps {
  control: any;
  name: string;
}

const ExpirationSection: React.FC<ExpirationSectionProps> = ({ control, name }) => {
  console.log("ExpirationSection", name);
  return (
    <ColumnText
      title="Vencimiento"
      icon={<Files size={16} color="#7B7B7B" />}
      content={
        <InputDateForm
          hiddenTitle
          titleInput="Fecha de expedición"
          nameInput={name}
          placeholder="Seleccionar fecha de expiración"
          control={control}
          error={undefined}
          customStyleContainer={{ width: "100%" }}
        />
      }
    />
  );
};

export default ExpirationSection;
