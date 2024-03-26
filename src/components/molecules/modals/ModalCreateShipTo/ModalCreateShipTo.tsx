import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Flex, Input, Modal, Switch, Typography } from "antd";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { ModalAddress } from "../ModalAddress/ModalAddress";
import { SelectCustom } from "@/components/molecules/selects/SelectCustom/SelectCustom";

import "./modalcreateshipto.scss";
const { Text, Title } = Typography;
interface Props {
  isOpen: boolean;
  setIsCreateShipTo: Dispatch<SetStateAction<boolean>>;
}
export type ShipToType = {
  info: {
    name: string;
    cargo: string;
    email: string;
    phone: string;
    rol: string;
  };
};

export const ModalCreateShipTo = ({ isOpen, setIsCreateShipTo }: Props) => {
  const [isEditAvailable] = useState(false);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<ShipToType>({
    defaultValues: {},
    disabled: isEditAvailable
    // values: isViewDetailsUser?.active ? dataToDataForm(dataUser.data) : ({} as ShipToType)
  });
  return (
    <>
      <Modal
        width={"40%"}
        open={isOpen}
        title={<Title level={4}>Crear nuevo Ship To</Title>}
        className="modalcreateshipto"
        okButtonProps={{
          className: "buttonOk"
        }}
        cancelButtonProps={{
          className: "buttonCancel"
        }}
        okText="Siguiente"
        cancelText="Cancelar"
        onCancel={() => setIsCreateShipTo(false)}
      >
        <Flex wrap="wrap" justify="space-around" style={{ paddingTop: "1rem" }}>
          <InputForm
            titleInput="Código Ship To"
            control={control}
            nameInput="info.name"
            error={errors.info?.name}
            customStyle={{ width: "45.5%" }}
          />
          <Flex vertical style={{ width: "45.5%" }}>
            <Title level={5}>Ubicacion</Title>
            <Input
              variant="borderless"
              className="input"
              placeholder="Ingresar ubicacion"
              onClick={() => setIsOpenAddress(true)}
            />
          </Flex>
        </Flex>
        <Flex gap={".5rem"} style={{ padding: "1rem .76rem" }}>
          <Switch />
          <Text>Heredar parámetros del cliente</Text>
        </Flex>
        <Flex wrap="wrap" justify="space-between" gap={".8rem"} style={{ padding: ".95rem" }}>
          <SelectCustom
            titleSelect="Período de facturación"
            errors={errors.info?.email}
            options={[{}, {}, {}]}
          />
          <SelectCustom
            titleSelect="Tipo de radicación"
            errors={errors.info?.email}
            options={[{}, {}, {}]}
          />
          <SelectCustom
            titleSelect="Condición de pago"
            errors={errors.info?.email}
            options={[{}, {}, {}]}
          />
        </Flex>
      </Modal>
      <ModalAddress setIsOpenAddress={setIsOpenAddress} isOpen={isOpenAddress} />
    </>
  );
};
