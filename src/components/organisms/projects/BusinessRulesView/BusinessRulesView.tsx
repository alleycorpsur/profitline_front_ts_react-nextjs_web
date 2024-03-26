import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import { Pencil } from "phosphor-react";

import { SelectHoldingBR } from "@/components/molecules/selects/SelectHoldingBR/SelectHoldingBR";
import { SelectStructureBR } from "@/components/molecules/selects/SelectStructureBR/SelectStructureBR";
import { SelectZoneBR } from "@/components/molecules/selects/SelectZoneBR/SelectZoneBR";

const { Title } = Typography;

export const BusinessRulesView = () => {
  const [isDisabledRules, setIsDisabledRules] = useState(true);

  return (
    <Flex vertical>
      <Flex justify="space-between">
        <Title level={5}>Configurar reglas de negocio</Title>
        <Button
          size="large"
          onClick={() => setIsDisabledRules(!isDisabledRules)}
          className="buttonOutlined"
          style={{ display: "flex" }}
          icon={<Pencil size={"1.45rem"} />}
        >
          {isDisabledRules ? "Editar Reglas" : "Ver Reglas"}
        </Button>
      </Flex>
      <Flex style={{ paddingTop: "1rem" }} gap="2rem">
        <Flex style={{ width: "27%" }} vertical>
          <SelectZoneBR isDisabledEdit={isDisabledRules} />
          {/* -------------comment for future use, this is block cause we haven't definition---------------------- */}
          {/* <DocumentClientBR /> */}
        </Flex>
        <Flex style={{ width: "38%" }}>
          <SelectStructureBR isDisabledEdit={isDisabledRules} />
        </Flex>
        <Flex style={{ width: "27%" }}>
          <SelectHoldingBR isDisabledEdit={isDisabledRules} />
        </Flex>
      </Flex>
    </Flex>
  );
};
