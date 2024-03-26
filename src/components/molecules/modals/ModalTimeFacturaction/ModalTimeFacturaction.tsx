import { Dispatch, SetStateAction } from "react";
import { Flex, Input, Modal, Radio, Space, Typography } from "antd";

import "./modaltimefacturaction.scss";
import { SelectCustom } from "@/components/molecules/selects/SelectCustom/SelectCustom";

const { Text } = Typography;
interface Props {
  isOpen: boolean;
  setIsTimeFacturaction: Dispatch<SetStateAction<boolean>>;
}
export const ModalTimeFacturaction = ({ isOpen, setIsTimeFacturaction }: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsTimeFacturaction(false)}
      title="Periodo de facturación"
      okButtonProps={{
        className: "buttonOk"
      }}
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      okText="Siguiente"
      cancelText="Cancelar"
      className="modaltimefacturaction"
      onOk={() => setIsTimeFacturaction(false)}
    >
      <Flex vertical>
        <Text>Selecciona el corte de facturación</Text>
        <Radio.Group style={{ padding: "1.2rem .5rem" }}>
          <Space direction="vertical">
            <Radio value={1}>
              <Flex align="center" gap="1rem">
                <Text>El día</Text>
                <Flex vertical style={{ width: "80.5%" }} justify="center">
                  <Input
                    variant="borderless"
                    className="input"
                    placeholder="Segundo miércoles del mes"
                    onClick={() => setIsTimeFacturaction(true)}
                  />
                </Flex>
              </Flex>
            </Radio>
            <Radio value={2} style={{ width: "100%" }}>
              <Flex align="center" gap="1rem" style={{ width: "100%" }}>
                <Text>El</Text>
                <Flex style={{ width: "20rem", gap: "1rem", marginLeft: "1rem" }}>
                  <SelectCustom options={[]} placeHolder="Segundo" errors={false} />
                  <SelectCustom options={[]} placeHolder="Miercoles" errors={false} />
                </Flex>
              </Flex>
            </Radio>
          </Space>
        </Radio.Group>
        <Text>El periodo de facturación inicia cada segundo miércoles del mes</Text>
      </Flex>
    </Modal>
  );
};
