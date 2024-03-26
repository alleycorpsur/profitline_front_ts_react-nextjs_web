import { useState } from "react";
import { Button, message } from "antd";
import { useForm } from "react-hook-form";

import { InputForm } from "../InputForm/InputForm";
import { useStructureBR } from "@/hooks/useBusinessRules";

import "./inputcreatechannel.scss";

export type ChannelType = {
  channel: string;
};
interface Props {
  isEditAvailable: boolean;
}
export const InputCreateChannel = ({ isEditAvailable = false }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addChannel } = useStructureBR();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChannelType>({
    defaultValues: { channel: "" },
    disabled: !isEditAvailable
  });
  const onSubmit = async (data: ChannelType) => {
    setIsLoading(true);
    await addChannel(data.channel, messageApi);
    reset();
    setIsLoading(false);
  };
  return (
    <>
      {contextHolder}
      <form className="inputcreatezone" onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          titleInput=""
          control={control}
          nameInput="channel"
          error={errors.channel}
          customStyle={{
            width: "96%",
            backgroundColor: "transparent !important",
            border: "1px solid white",
            borderRadius: ".8rem"
          }}
          placeholder="Ingresar nombre del canal"
        />
        <Button htmlType="submit" loading={isLoading} className="createButtonZone">
          Crear{" "}
        </Button>
      </form>
    </>
  );
};
