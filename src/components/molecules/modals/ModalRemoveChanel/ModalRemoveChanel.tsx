import { Modal, Typography } from "antd";
import "./modalremovechanel.scss";
import { IChanel } from "@/types/bre/IBRE";
import { Fragment } from "react";

const { Text } = Typography;

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  name?: string;
  onClose: () => void;
  onRemove?: () => void;
  channelData: IChanel;
}
export const ModalRemoveChanel = ({ isOpen, isLoading, channelData, onClose, onRemove }: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      okButtonProps={{ className: "acceptButton", loading: isLoading }}
      okText="Eliminar Canal"
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      className="modalChangeStatusChanel"
      title={`¿Estás seguro que deseas eliminar este canal?`}
      onOk={onRemove}
    >
      <Text className="title">Este canal contiene:</Text>
      <br />
      <br />
      {channelData?.CHANNEL_LINES?.map((line) => (
        <Fragment key={line.id}>
          <Text className="title">Linea: {line.description} </Text>
          <br />
          {line?.sublines?.map((subline) => (
            <Text key={subline.id}> {subline.description ?? ""}.</Text>
          ))}
          <br />
          <br />
        </Fragment>
      ))}

      <Text className="title">Esta acción es definitiva </Text>
    </Modal>
  );
};
