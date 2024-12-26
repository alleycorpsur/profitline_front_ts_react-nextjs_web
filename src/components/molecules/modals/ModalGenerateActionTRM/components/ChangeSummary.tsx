import React from "react";
import { Flex, List, Typography } from "antd";
import { formatNumber } from "@/utils/utils";
import FooterButtons from "@/components/atoms/FooterButtons/FooterButtons";
import { ExchangeRate } from "..";

const { Text } = Typography;

interface ChangeSummaryProps {
  exchangeRates: ExchangeRate[];
  loadingSubmit: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  selectedRowKeys: React.Key[];
}

const ChangeSummary: React.FC<ChangeSummaryProps> = ({
  exchangeRates,
  loadingSubmit,
  onClose,
  handleConfirm,
  selectedRowKeys
}) => {
  return (
    <Flex vertical gap={24}>
      <Flex vertical>
        <Text style={{ fontSize: "16px", fontWeight: 300 }}>
          Se está reemplazando la TRM para {selectedRowKeys?.length} fechas:
        </Text>
        <List
          dataSource={exchangeRates}
          renderItem={({ currency, newRate }) => (
            <Flex align="center" gap="4px">
              <span style={{ fontSize: "20px", marginRight: "8px" }}>•</span>
              <Text style={{ fontSize: "16px", fontWeight: 300 }}>
                {`${currency} = Por $${formatNumber(newRate)}`}
              </Text>
            </Flex>
          )}
        />
      </Flex>
      <FooterButtons
        titleConfirm="Aceptar"
        onClose={onClose}
        handleOk={handleConfirm}
        isConfirmDisabled={false}
        isConfirmLoading={loadingSubmit}
      />
    </Flex>
  );
};

export default ChangeSummary;
