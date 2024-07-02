import "./ModalDeleteDiscount.scss";
import { Modal, Typography } from "antd";

const { Text } = Typography;
interface Props {
  isOpen: boolean;
  isLoading: boolean;
  name?: string;
  onClose: () => void;
  onRemove?: () => void;
}
export const ModalDeleteDiscount = ({ isOpen, isLoading, onClose, onRemove }: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      okButtonProps={{ className: "buttonOk", loading: isLoading }}
      okText="Eliminar descuento"
      cancelText="Cancelar"
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      className="modalDeleteDiscount"
      title={
        <Text style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
          ¿Estás seguro que deseas eliminar este/os descuento(s)?
        </Text>
      }
      onOk={onRemove}
    >
      <Text style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
        Esta acción es definitiva
      </Text>
      <br />
    </Modal>
  );
};
