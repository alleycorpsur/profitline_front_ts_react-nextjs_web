import { Button, Flex, MenuProps } from "antd";
import { useState } from "react";
import { Bank, CaretLeft } from "phosphor-react";

import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import BanksRulesTable from "../../components/banks-rules-table/Banks-rules-table";
import { BankRuleModal } from "../../components/bank-rule-modal/Bank-rule-modal";

import styles from "./banks-rules.module.scss";

interface PropsBanksRules {
  onClickBack: () => void;
}

export const BanksRules = ({ onClickBack }: PropsBanksRules) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showBankRuleModal, setShowBankRuleModal] = useState({
    isOpen: false,
    ruleId: 0
  });

  const handleDeleteRules = () => {
    console.info("Delete rules with ids", selectedRowKeys);
  };

  const handleCreateNewRule = () => {
    setShowBankRuleModal({
      isOpen: true,
      ruleId: 0
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "discount-option-1",
      label: (
        <Button className="buttonOutlined" onClick={handleDeleteRules}>
          Eliminar
        </Button>
      )
    }
  ];

  return (
    <div className={styles.banksRules}>
      <Flex justify="space-between" style={{ height: "3rem" }} align="center">
        <Button
          type="text"
          size="large"
          style={{ paddingLeft: 0, fontWeight: 600 }}
          onClick={onClickBack}
          icon={<CaretLeft size={"1.45rem"} />}
        >
          Reglas de bancos
        </Button>

        <PrincipalButton
          onClick={handleCreateNewRule}
          customStyles={{ marginLeft: "auto", height: "3rem" }}
        >
          Crear nueva regla <Bank size={16} />
        </PrincipalButton>
      </Flex>

      <div className={styles.tableHeaderButtons}>
        <UiSearchInput
          placeholder="Buscar"
          onChange={(event) => {
            setTimeout(() => {
              console.info(event.target.value);
            }, 1000);
          }}
        />
        <FilterDiscounts />
        <DotsDropdown items={items} />
      </div>

      <BanksRulesTable
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        rules={mockRules}
        setShowBankRuleModal={setShowBankRuleModal}
      />

      <BankRuleModal
        showBankRuleModal={showBankRuleModal}
        onClose={() =>
          setShowBankRuleModal({
            isOpen: false,
            ruleId: 0
          })
        }
      />
    </div>
  );
};

export default BanksRules;

const mockRules = [
  {
    id: 1,
    description: "Cooperativa nacional de drog",
    client_name: "Coopidrogas",
    coincidence: "Coincidencia exacta"
  },
  {
    id: 2,
    description: "Cooperativa nacional de drog",
    client_name: "Coopidrogas",
    coincidence: "Contiene"
  },
  {
    id: 3,
    description: "Cooperativa nacional de drog",
    client_name: "Coopidrogas",
    coincidence: "Coincidencia exacta"
  },
  {
    id: 4,
    description: "Cooperativa nacional de drog",
    client_name: "Coopidrogas",
    coincidence: "Coincidencia exacta"
  }
];
