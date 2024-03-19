import { Dispatch, SetStateAction } from "react";
import { Flex, Modal, Radio, Space, Typography } from "antd";

import "./modalstatusclient.scss";

const { Text } = Typography;
interface Props {
  isOpen: boolean;
  typeToRemove?: string;
  isLegalCollection?: boolean;
  setIsStatusClient: Dispatch<SetStateAction<{ status: boolean; remove: boolean }>>;
}
export const ModalStatusClient = ({
  isOpen,
  isLegalCollection = true,
  typeToRemove = "Usuario",
  setIsStatusClient
}: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsStatusClient({ status: false, remove: false })}
      title="Cambio de estado"
      okButtonProps={{
        className: "buttonOk"
      }}
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      okText="Siguiente"
      cancelText="Cancelar"
      className="modalstatusclient"
      onOk={() => setIsStatusClient({ status: false, remove: false })}
    >
      <Flex vertical>
        <Text>Selecciona el nuevo estado del usuario</Text>
        <Radio.Group style={{ padding: "1rem 0", width: "100%" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Flex className="radioStatus">
              <Radio value={1} style={{ width: "100%" }}>
                Activo
              </Radio>
            </Flex>
            <Flex className="radioStatus">
              <Radio value={2}>Inactivo</Radio>
            </Flex>
            {isLegalCollection && (
              <Flex className="radioStatus">
                <Radio value={3}>Cobro Juridico</Radio>
              </Flex>
            )}
          </Space>
        </Radio.Group>
        <Text
          className="deleteText"
          onClick={() => setIsStatusClient({ status: true, remove: true })}
        >
          Eliminar {typeToRemove}
        </Text>
      </Flex>
    </Modal>
  );
};
