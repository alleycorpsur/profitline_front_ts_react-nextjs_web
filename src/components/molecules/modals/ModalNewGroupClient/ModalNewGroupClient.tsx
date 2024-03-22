import { Modal, Typography } from "antd";

import { useForm } from "react-hook-form";
import { InputForm } from "@/components/atoms/InputForm/InputForm";

import "./modalnewgroupclient.scss";
import { useState } from "react";
import { ModalSelectClients } from "../ModalSelectClients/ModalSelectClients";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const { Title, Text } = Typography;
export type GroupClientType = {
  group: {
    name: string;
  };
};
const initValuesDetails = { active: false, id: 0 };

export const ModalNewGroupClient = ({ isOpen, onClose }: Props) => {
  const {
    control,
    formState: { errors }
  } = useForm<GroupClientType>({
    defaultValues: {}
  });
  const [isDetailsClient, setIsDetailsClient] = useState(initValuesDetails);

  return (
    <>
      <Modal
        width={"35%"}
        open={isOpen}
        title={<Title level={4}>Nuevo grupo de clientes</Title>}
        className="modalcreategroup"
        okButtonProps={{
          className: "buttonOk"
        }}
        cancelButtonProps={{
          className: "buttonCancel"
        }}
        okText="Siguiente"
        cancelText="Cancelar"
        onCancel={onClose}
        onOk={() => setIsDetailsClient({ active: true, id: 1 })}
      >
        <Text className="text">Ingresa el nombre del grupo de clientes </Text>
        <InputForm
          titleInput="Nombre"
          placeholder="Clientes pareto"
          control={control}
          nameInput="group.name"
          error={errors.group?.name}
          customStyle={{ width: "50%" }}
        />
      </Modal>
      <ModalSelectClients
        nameGroupClient="Pareto"
        isCreate={true}
        onClose={() => setIsDetailsClient(initValuesDetails)}
        isOpen={isDetailsClient.active}
      />
    </>
  );
};
