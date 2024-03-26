import { Button, Flex, Popover, Spin, Typography, message } from "antd";
import { Plus, X } from "phosphor-react";
import { InputCreateZone } from "@/components/atoms/inputs/InputCreateZone/InputCreateZone";

import { useZone } from "@/hooks/useZone";

import "./selectzonebr.scss";

interface Props {
  isDisabledEdit: boolean;
}

export const SelectZoneBR = ({ isDisabledEdit }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, removeZone } = useZone();
  return (
    <div className="selectzonebr">
      {contextHolder}

      <Typography.Text className="title">Zonas</Typography.Text>
      <Flex vertical className="zones">
        {isLoading ? (
          <Spin />
        ) : (
          <Flex vertical className="zonesItems">
            {data?.data.map((zone) => {
              return (
                <Flex key={zone.ID} justify="space-between" className="zone">
                  <Typography.Text>{zone.ZONE_DESCRIPTION}</Typography.Text>
                  {!isDisabledEdit && (
                    <Button
                      onClick={() => removeZone(`${zone.ID}`, messageApi)}
                      icon={<X size={"12px"} />}
                      className="removebutton"
                    />
                  )}
                </Flex>
              );
            })}
          </Flex>
        )}
        {!isDisabledEdit && (
          <Popover content={<InputCreateZone isEditAvailable />} trigger="click" placement="bottom">
            <Button icon={<Plus size={"16px"} />} className="addButton" type="text">
              Agregar zona
            </Button>
          </Popover>
        )}
      </Flex>
    </div>
  );
};
