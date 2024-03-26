import { Button, Flex, Input, Modal, Typography, message } from "antd";
import { SelectClientsTable } from "../../tables/SelectClientsTable/SelectClientsTable";
import { CaretDown, CaretLeft } from "phosphor-react";

import "./modalnewgroupclient.scss";
import { Key } from "antd/es/table/interface";
import { Dispatch, SetStateAction } from "react";
import { useGroupClients } from "@/hooks/useGroupClients";

interface Props {
  isOpen: boolean;
  isCreate?: boolean;
  onClose: () => void;
  nameGroupClient: string;
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}
const { Title, Text } = Typography;

const { Search } = Input;

export const ModalSelectClients = ({
  isOpen,
  isCreate = false,
  nameGroupClient,
  onClose,
  selectedRowKeys,
  setSelectedRowKeys
}: Props) => {
  const { createGroupClient } = useGroupClients();
  const [messageApi, contextHolder] = message.useMessage();

  const createGroup = () => {
    const data = createGroupClient({
      data: { name: nameGroupClient, clients: selectedRowKeys },
      messageApi: messageApi,
      onClose: () => {}
    });
    console.log(data);
  };

  return (
    <>
      {contextHolder}
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
        onOk={createGroup}
      >
        <Text className="text">Selecciona los clientes para añadir al grupo</Text>
        <Flex className="header">
          <Search placeholder="Buscar " />
          <Button className="button" icon={<CaretDown size={"1.2rem"} />}>
            Filtrar
          </Button>
        </Flex>
        <SelectClientsTable
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </Modal>
    </>
  );
};
