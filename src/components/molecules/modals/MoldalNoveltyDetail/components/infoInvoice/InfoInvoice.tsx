import React from "react";
import { NewspaperClipping, Coins } from "phosphor-react";
import { Typography } from "antd";

import { useAppStore } from "@/lib/store/store";
import { formatMoney } from "@/utils/utils";
import { useModalDetail } from "@/context/ModalContext";
import { IIncidentDetail } from "@/hooks/useNoveltyDetail";

import { IconLabel } from "@/components/atoms/IconLabel/IconLabel";

import "./infoinvoice.scss";
const { Text } = Typography;

interface InfoInvoiceProps {
  incidentData: IIncidentDetail;
}

export const InfoInvoice: React.FC<InfoInvoiceProps> = ({ incidentData }) => {
  const {
    invoice_cashport_value,
    invoice_amount_difference,
    invoice_client_value,
    id_erp: FacturaID,
    client_id,
    invoice_id
  } = incidentData;

  const { ID: projectId } = useAppStore((state) => state.selectedProject);

  const { openModal } = useModalDetail();

  const handleOpenInvoiceDetail = () => {
    openModal("invoice", {
      showId: FacturaID,
      invoiceId: invoice_id,
      projectId,
      clientId: client_id,
      hiddenActions: true
    });
  };

  return (
    <div className="info-invoices">
      <IconLabel icon={<NewspaperClipping size={20} />} text="Factura" />
      <Text className="invoice-id" onClick={handleOpenInvoiceDetail}>
        {FacturaID}
      </Text>

      <IconLabel icon={<Coins size={20} />} text="Valores" />
      <div className="values-container">
        <div className="value-row">
          <Text>Cashport</Text>
          <Text strong>{formatMoney(invoice_cashport_value)}</Text>
        </div>
        <div className="value-row">
          <Text>Cliente</Text>
          <Text strong>{formatMoney(invoice_client_value)}</Text>
        </div>
        <div className="value-row difference">
          <Text>Novedad</Text>
          <Text type="danger" strong>
            {formatMoney(invoice_amount_difference || 0)}
          </Text>
        </div>
      </div>
    </div>
  );
};
