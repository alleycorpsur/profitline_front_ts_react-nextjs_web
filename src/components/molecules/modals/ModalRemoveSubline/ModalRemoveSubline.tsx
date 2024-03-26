import { Modal, Typography } from "antd";
import "./modalremovesubline.scss";

const { Text } = Typography;

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  sublineDescription: string;
  onClose: () => void;
  onRemove?: () => void;
}
export const ModalRemoveSubline = ({
  isOpen,
  isLoading,
  sublineDescription,
  onClose,
  onRemove
}: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      okButtonProps={{ className: "acceptButton", loading: isLoading }}
      okText="Eliminar Sublinea"
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      className="modalChangeStatusChanel"
      title={`¿Estás seguro que deseas eliminar esta sublinea?`}
      onOk={onRemove}
    >
      <Text className="title">Sublinea: {sublineDescription}</Text>
      <br />
      <Text className="title">Esta acción es definitiva </Text>
    </Modal>
  );
};
