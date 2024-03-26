import { useState } from "react";
import { Button, message } from "antd";
import { useForm } from "react-hook-form";

import { InputForm } from "../InputForm/InputForm";
import { useStructureBR } from "@/hooks/useBusinessRules";

import "./inputcreatesubline.scss";

export type SublineType = {
  subline: string;
};
interface Props {
  isEditAvailable: boolean;
  idLine: string;
}
export const InputCreateSubline = ({ isEditAvailable = false, idLine }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addSubline } = useStructureBR();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SublineType>({
    defaultValues: { subline: "" },
    disabled: !isEditAvailable
  });
  const onSubmit = async (data: SublineType) => {
    setIsLoading(true);
    await addSubline(idLine, data.subline, messageApi);
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
          nameInput="subline"
          error={errors.subline}
          customStyle={{
            width: "96%",
            backgroundColor: "transparent !important",
            border: "1px solid white",
            borderRadius: ".8rem"
          }}
          placeholder="Ingresar nombre de la sublinea"
        />
        <Button htmlType="submit" loading={isLoading} className="createButtonZone">
          Crear{" "}
        </Button>
      </form>
    </>
  );
};
