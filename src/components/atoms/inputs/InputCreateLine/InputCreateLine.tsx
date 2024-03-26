import { useState } from "react";
import { Button, message } from "antd";
import { useForm } from "react-hook-form";

import { InputForm } from "../InputForm/InputForm";
import { useStructureBR } from "@/hooks/useBusinessRules";

import "./inputcreateline.scss";

export type LineType = {
  line: string;
};
interface Props {
  isEditAvailable: boolean;
  idChannel: string;
}
export const InputCreateLine = ({ isEditAvailable = false, idChannel }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addLine } = useStructureBR();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LineType>({
    defaultValues: { line: "" },
    disabled: !isEditAvailable
  });
  const onSubmit = async (data: LineType) => {
    setIsLoading(true);
    await addLine(idChannel, data.line, messageApi);
    reset();
    setIsLoading(false);
  };
  return (
    <>
      {contextHolder}
      <form className="inputcreateline" onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          titleInput=""
          control={control}
          nameInput="line"
          error={errors.line}
          customStyle={{
            width: "96%",
            backgroundColor: "transparent !important",
            border: "1px solid white",
            borderRadius: ".8rem"
          }}
          placeholder="Ingresar nombre de la linea"
        />
        <Button htmlType="submit" loading={isLoading} className="createButtonZone">
          Crear{" "}
        </Button>
      </form>
    </>
  );
};
