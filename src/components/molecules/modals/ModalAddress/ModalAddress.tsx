import { AddressContainer } from "@/components/atoms/AddressContainer/AddressContainer";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { Flex, Modal, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import "./modaladdress.scss";
import { InputAddress } from "@/components/atoms/inputs/InputAddress/InputAddress";
import { ModalBusinessRules } from "../ModalBusinessRules/ModalBusinessRules";

const { Title } = Typography;
interface Props {
  isOpen: boolean;
  setIsOpenAddress: Dispatch<SetStateAction<boolean>>;
}
export type AddressType = {
  info: {
    name: string;
    cargo: string;
    email: string;
    phone: string;
    rol: string;
  };
};
export const ModalAddress = ({ isOpen, setIsOpenAddress }: Props) => {
  const [isEditAvailable] = useState(false);
  const [isOpenBR, setIsOpenBR] = useState(false);
  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<AddressType>({
    defaultValues: {},
    disabled: isEditAvailable
    // values: isViewDetailsUser?.active ? dataToDataForm(dataUser.data) : ({} as ShipToType)
  });

  return (
    <>
      <Modal
        width={"40%"}
        open={isOpen}
        okButtonProps={{ className: "buttonOk" }}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Guardar ubicación"
        title={<Title level={4}>Ingresar ubicacion</Title>}
        className="modaladdress"
        onCancel={() => setIsOpenAddress(false)}
        onOk={() => setIsOpenBR(true)}
      >
        <Flex wrap="wrap" justify="flex-start" style={{ paddingTop: "1rem" }}>
          <InputForm
            titleInput="Ciudad"
            control={control}
            nameInput="info.name"
            error={errors.info?.name}
            customStyle={{ width: "45.5%" }}
          />
        </Flex>
        <Title level={5} className="titleSection">
          Ubicaciones disponibles ya creadas
        </Title>
        <Flex wrap="wrap" justify="flex-start" style={{ padding: ".3rem" }} gap={".5rem"}>
          <AddressContainer />
          <AddressContainer />
          <AddressContainer />
          <AddressContainer />
          <AddressContainer />
        </Flex>
        <Title level={5} className="titleSection">
          Crear ubicación del Ship To
        </Title>
        <InputAddress control={control} errors={errors} />
      </Modal>
      <ModalBusinessRules isOpen={isOpenBR} setIsBR={setIsOpenBR} />
    </>
  );
};
