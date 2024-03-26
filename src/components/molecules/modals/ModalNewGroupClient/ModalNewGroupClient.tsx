import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Typography } from "antd";
import { useForm } from "react-hook-form";

import { InputForm } from "@/components/atoms/InputForm/InputForm";
import { ModalSelectClients } from "../ModalSelectClients/ModalSelectClients";

import "./modalnewgroupclient.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDetailsClients: {
    active: boolean;
    id: number;
  };
  setIsDetailsClients: Dispatch<
    SetStateAction<{
      active: boolean;
      id: number;
    }>
  >;
}
const { Title, Text } = Typography;

export type GroupClientType = {
  group: {
    name: string;
  };
};
const initValuesDetails = { active: false, id: 0 };

export const ModalNewGroupClient = ({
  isOpen,
  onClose,
  isDetailsClients,
  setIsDetailsClients
}: Props) => {
  const {
    control,
    formState: { errors },
    watch
  } = useForm<GroupClientType>({
    defaultValues: {
      group: { name: "" }
    }
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const nameGroup = watch("group.name");

  return (
    <>
      <Modal
        width={"35%"}
        open={isOpen}
        title={<Title level={4}>Nuevo grupo de clientes</Title>}
        className="modalcreategroup"
        okButtonProps={{
          className: "buttonOk",
          disabled: nameGroup.length < 2
        }}
        cancelButtonProps={{
          className: "buttonCancel"
        }}
        okText="Siguiente"
        cancelText="Cancelar"
        onCancel={onClose}
        onOk={() => setIsDetailsClients({ active: true, id: 1 })}
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
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        nameGroupClient={nameGroup}
        isCreate={true}
        onClose={() => setIsDetailsClients(initValuesDetails)}
        isOpen={isDetailsClients.active}
      />
    </>
  );
};
