import { Button, Checkbox, Flex, Spin, Typography } from "antd";
import { CaretDoubleRight, FileArrowUp, X } from "phosphor-react";

import { useDocumentByClient } from "@/hooks/useDocumentByClient";
import "./documentclientbr.scss";

const { Text } = Typography;

export const DocumentClientBR = () => {
  const { data, isLoading } = useDocumentByClient();
  console.log(data);

  return (
    <div className="contianerdocumentclientbr">
      <Typography.Text className="title">Documentos por cliente</Typography.Text>
      <Flex vertical className="holdings">
        {isLoading ? (
          <Spin />
        ) : (
          <>
            {data?.data.map((document) => (
              <Flex className="documentclientbr" key={document.id} vertical>
                <Flex justify="space-between">
                  <Text className="titleLineBR">Institucional</Text>
                  <Button icon={<X size={"16px"} />} className="removebutton" />
                </Flex>
                <Flex className="lineBR" vertical>
                  <Flex justify="space-between">
                    <Text className="subtitleLineBR">Creacion de Cliente</Text>
                    <Button icon={<X size={"16px"} />} className="removebutton" />
                  </Flex>
                  <Flex className="mainSublinesBR">
                    <Flex vertical>
                      <Checkbox checked={document.required === 1}>Obligatorio</Checkbox>
                      <Button
                        type="text"
                        icon={<FileArrowUp size={"16px"} />}
                        className="buttonTextDocument"
                        href={document.format_document}
                        target="_blank"
                      >
                        Plantilla_Creacion_de_Cliente
                      </Button>
                    </Flex>
                  </Flex>
                  <Button
                    icon={<CaretDoubleRight size={"16px"} />}
                    className="addButtonLineSub"
                    type="text"
                  >
                    Agregar documento
                  </Button>
                </Flex>
                <Button
                  icon={<CaretDoubleRight size={"16px"} />}
                  className="addButtonLineSub"
                  type="text"
                >
                  Agregar cliente
                </Button>
              </Flex>
            ))}
          </>
        )}
      </Flex>
    </div>
  );
};
