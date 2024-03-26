import { useState } from "react";
import { Button, Flex, Popover, Spin, Typography, message } from "antd";
import { Plus } from "phosphor-react";

import { ChannelBR } from "@/components/atoms/ChannelBR/ChannelBR";
import { InputCreateChannel } from "@/components/atoms/inputs/InputCreateChannel/InputCreateChannel";
import { ModalRemoveChanel } from "../../modals/ModalRemoveChanel/ModalRemoveChanel";

import { useStructureBR } from "@/hooks/useBusinessRules";
import { IChanel } from "@/types/bre/IBRE";

import "./selectstructurebr.scss";

const initModalRemoveChanel = { active: false, idChannel: 0 };
interface Props {
  isDisabledEdit: boolean;
}
export const SelectStructureBR = ({ isDisabledEdit }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [modalRemove, setModalRemove] = useState(initModalRemoveChanel);
  const { data, isLoading, removeChannel } = useStructureBR();
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const dataFinal = typeof data?.data === "string" ? [] : data?.data;

  const filterChannel =
    dataFinal?.filter((channel) => channel.CHANNEL_ID === modalRemove.idChannel)?.[0] ??
    ({} as IChanel);

  const onRemoveCh = async () => {
    setIsLoadingRemove(true);
    removeChannel(`${modalRemove.idChannel}`, messageApi);
    setIsLoadingRemove(false);
    setModalRemove(initModalRemoveChanel);
  };
  return (
    <>
      {contextHolder}
      <div className="selectzonebr">
        <Typography.Text className="title">Estructura</Typography.Text>
        <Flex vertical className="bres">
          {isLoading ? (
            <Spin />
          ) : (
            <Flex className="holdingsItems" vertical>
              {dataFinal?.map((channel) => (
                <ChannelBR
                  key={channel.CHANNEL_ID}
                  isDisabledEdit={isDisabledEdit}
                  channel={channel}
                  setModalRemove={setModalRemove}
                />
              ))}
            </Flex>
          )}
          {!isDisabledEdit && (
            <Popover
              content={<InputCreateChannel isEditAvailable />}
              trigger="click"
              placement="bottom"
            >
              <Button icon={<Plus size={"16px"} />} className="addButton" type="text">
                Agregar Canal
              </Button>
            </Popover>
          )}
        </Flex>
      </div>
      <ModalRemoveChanel
        isOpen={modalRemove.active}
        isLoading={isLoadingRemove}
        channelData={filterChannel}
        onClose={() => setModalRemove(initModalRemoveChanel)}
        onRemove={onRemoveCh}
      />
    </>
  );
};
