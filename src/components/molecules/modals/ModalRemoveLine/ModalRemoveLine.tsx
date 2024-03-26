import { Modal, Typography } from "antd";

import { ChannelLine } from "@/types/bre/IBRE";

import "./modalremoveline.scss";

const { Text } = Typography;

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  name?: string;
  onClose: () => void;
  onRemove?: () => void;
  lineData: ChannelLine;
}
export const ModalRemoveLine = ({ isOpen, isLoading, lineData, onClose, onRemove }: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      okButtonProps={{ className: "acceptButton", loading: isLoading }}
      okText="Eliminar Linea"
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      className="modalChangeStatusChanel"
      title={`¿Estás seguro que deseas eliminar esta linea?`}
      onOk={onRemove}
    >
      <Text className="title">Linea: {lineData.description} </Text>
      <br />
      {lineData?.sublines?.map((subline) => (
        <Text key={subline.id}> {subline.description ?? ""}.</Text>
      ))}
      <br />
      <br />
      <Text className="title">Esta acción es definitiva </Text>
    </Modal>
  );
};
