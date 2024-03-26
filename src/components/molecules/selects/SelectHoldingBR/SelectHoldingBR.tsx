import { Button, Flex, Popover, Spin, Typography, message } from "antd";
import { Plus, X } from "phosphor-react";

import { InputCreateHolding } from "@/components/atoms/inputs/InputCreateHolding/InputCreateHolding";
import { useHolding } from "@/hooks/useHolding";

import "./selectholdingbr.scss";
interface Props {
  isDisabledEdit: boolean;
}
export const SelectHoldingBR = ({ isDisabledEdit }: Props) => {
  const { data, isLoading, removeHolding } = useHolding();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="selectholdingbr">
      {contextHolder}
      <Typography.Text className="title">Holdings</Typography.Text>
      <Flex vertical className="holdings">
        {isLoading ? (
          <Spin />
        ) : (
          <Flex vertical className="holdingsItems">
            {data?.data.map((holding) => {
              return (
                <Flex key={holding.id} justify="space-between" className="holding">
                  <Typography.Text>{holding.name}</Typography.Text>
                  {!isDisabledEdit && (
                    <Button
                      onClick={() => removeHolding(`${holding.id}`, messageApi)}
                      icon={<X size={"10px"} />}
                      className="removebutton"
                    />
                  )}
                </Flex>
              );
            })}
          </Flex>
        )}
        {!isDisabledEdit && (
          <Popover
            content={<InputCreateHolding isEditAvailable />}
            trigger="click"
            placement="bottom"
          >
            <Button icon={<Plus size={"16px"} />} className="addButton" type="text">
              Agregar Holding
            </Button>
          </Popover>
        )}
      </Flex>
    </div>
  );
};
