import { Button, Flex, Typography, Upload } from "antd";
import { FileArrowUp, X } from "phosphor-react";

import "./uploadfilebutton.scss";

const { Text } = Typography;

interface Props {
  nameInput: string;
  isRequired?: boolean;
}

export const UploadFileButton = ({ nameInput = "", isRequired = true }: Props) => {
  return (
    <Flex className="uploaddocumentbutton">
      <Flex vertical>
        <Text className="titleDocument">{nameInput}</Text>
        <Text className="descriptionDocument">*{isRequired ? "Obligatorio" : "Opcional"}</Text>
      </Flex>
      <Upload style={{ width: "100%" }}>
        <Flex className="documentButton" vertical justify="center">
          <Flex justify="space-between" align="center">
            <Flex>
              <FileArrowUp size={"25px"} />
              <Text className="nameFile">Seleccionar Archivo</Text>
            </Flex>
            <Button type="text" icon={<X size={"20px"} onClick={(e) => e.preventDefault()} />} />
          </Flex>
          <Text className="sizeFile">PDF, Word, PNG. (Tamaño max 30MB)</Text>
        </Flex>
      </Upload>
    </Flex>
  );
};
