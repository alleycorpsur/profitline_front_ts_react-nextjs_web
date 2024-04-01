import { Dispatch, SetStateAction } from "react";
import { Flex, Modal, Typography } from "antd";

import "./modaluploaddocument.scss";
import { UploadFileButton } from "@/components/atoms/UploadFileButton/UploadFileButton";

interface Props {
  isOpen: boolean;
  setIsOpenUpload: Dispatch<SetStateAction<boolean>>;
}
const { Title, Text } = Typography;

export const ModalUploadDocument = ({ isOpen, setIsOpenUpload }: Props) => {
  return (
    <Modal
      width={"40%"}
      open={isOpen}
      okButtonProps={{ className: "buttonOk" }}
      cancelButtonProps={{
        className: "buttonCancel"
      }}
      okText="Guardar ubicación"
      title={<Title level={4}>Cargar Documentos</Title>}
      className="modaluploaddocument"
      onCancel={() => setIsOpenUpload(false)}
      onOk={() => setIsOpenUpload(false)}
    >
      <Text className="description">
        Haz clic en cada casilla para adjuntar los documentos requeridos
      </Text>
      <Flex vertical className="mainUploadDocuments">
        <UploadFileButton nameInput="RUT" />
        <UploadFileButton nameInput="Cámara de Comercio" />
        <UploadFileButton nameInput="Estados financieros" />
        <UploadFileButton nameInput="Formato de creación" />
        <UploadFileButton nameInput="Certificación Bancaria" />
        <UploadFileButton nameInput="Archivos adicionales" />
      </Flex>
    </Modal>
  );
};
