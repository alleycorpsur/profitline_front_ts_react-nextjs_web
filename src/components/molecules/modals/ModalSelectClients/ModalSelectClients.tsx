import { Button, Flex, Input, Modal, Typography } from "antd";
import { SelectClientsTable } from "../../tables/SelectClientsTable/SelectClientsTable";
import "./modalnewgroupclient.scss";
import { CaretDown, CaretLeft } from "phosphor-react";

interface Props {
  isOpen: boolean;
  isCreate?: boolean;
  onClose: () => void;
  nameGroupClient: string;
}
const { Title, Text } = Typography;

const { Search } = Input;

export const ModalSelectClients = ({
  isOpen,
  isCreate = false,
  nameGroupClient,
  onClose
}: Props) => {
  return (
    <Modal
      width={"40%"}
      open={isOpen}
      title={
        <Flex align="flex-end" gap={".5rem"}>
          {isCreate && (
            <Button
              onClick={onClose}
              type="text"
              size="large"
              icon={<CaretLeft size={"1.3rem"} />}
            />
          )}
          <Title level={4}>{nameGroupClient}</Title>
        </Flex>
      }
      className="modaldetailselectclient"
      okButtonProps={{
        className: "buttonOk"
      }}
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      okText={isCreate ? "Crear grupo" : "Guardar Cambios"}
      cancelText="Cancelar"
      onCancel={onClose}
    >
      <Text className="text">Selecciona los clientes para añadir al grupo</Text>
      <Flex className="header">
        <Search placeholder="Buscar " />
        <Button className="button" icon={<CaretDown size={"1.2rem"} />}>
          Filtrar
        </Button>
      </Flex>
      <SelectClientsTable />
    </Modal>
  );
};
