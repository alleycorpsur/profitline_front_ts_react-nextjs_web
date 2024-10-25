import React, { useEffect, useState } from "react";
import { Modal, Typography, Tabs, Button, Table, Flex } from "antd";
import { useForm, Controller } from "react-hook-form";

import "./modalAgreementDetail.scss";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";
import dayjs from "dayjs";
import { DotsThree, PaperclipHorizontal } from "phosphor-react";
import UiTab from "@/components/ui/ui-tab";
import { FileDownloadModal } from "../FileDownloadModal/FileDownloadModal";
import { IPaymentDetail } from "@/types/paymentAgreement/paymentAgreement";
import { getDetailPaymentAgreement } from "@/services/accountingAdjustment/accountingAdjustment";

const { Title, Text } = Typography;

interface Props {
  isModalPaymentAgreementOpen: {
    isOpen: boolean;
    incident_id: number;
  };
  onClose: () => void;
}
interface InvoiceData {
  key: string;
  idFactura: string;
  emision: string;
  pendiente: string;
  acordado: string;
  fecha: string;
}

interface FormData {
  responsible: string;
  agreementValue: string;
  creationDate: dayjs.Dayjs;
  evidence: { name: string; url: string; time: string }[];
  agreementStatus: string;
  invoicesCount: string;
  dueDate: dayjs.Dayjs;
}

const mockData: FormData = {
  responsible: "Maria Camila ahahaha",
  agreementValue: "19500.00",
  creationDate: dayjs("2023-03-24"),
  evidence: [
    {
      name: "Ajuste-Contable-2024",
      url: "https://example.com/ajuste-contable-2024.pdf",
      time: "08:34PM"
    },
    {
      name: "Ajuste-Contable-2024",
      url: "https://example.com/ajuste-contable-2024-2.pdf",
      time: "08:34PM"
    }
  ],
  agreementStatus: "Maria Camila Osorio",
  invoicesCount: "94",
  dueDate: dayjs("2023-03-24")
};

const invoicesData: InvoiceData[] = [
  {
    key: "1",
    idFactura: "1234556",
    emision: "23/04/2023",
    pendiente: "$28,000,000",
    acordado: "$25,000,000",
    fecha: "23/04/2023"
  },
  {
    key: "2",
    idFactura: "1234556",
    emision: "23/04/2023",
    pendiente: "$28,000,000",
    acordado: "$22,000,000",
    fecha: "23/04/2023"
  },
  {
    key: "3",
    idFactura: "1234556",
    emision: "23/04/2023",
    pendiente: "$19,000,000",
    acordado: "$19,000,000",
    fecha: "23/04/2023"
  },
  {
    key: "4",
    idFactura: "1234556",
    emision: "23/04/2023",
    pendiente: "$28,000,000",
    acordado: "$28,000,000",
    fecha: "23/04/2023"
  },
  {
    key: "5",
    idFactura: "1234556",
    emision: "23/04/2023",
    pendiente: "$28,000,000",
    acordado: "$28,000,000",
    fecha: "23/04/2023"
  }
];
export const ModalAgreementDetail: React.FC<Props> = ({ isModalPaymentAgreementOpen, onClose }) => {
  const [paymentAgreementData, setPaymentAgreementData] = useState<IPaymentDetail>();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: mockData
  });
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadTitle, setDownloadTitle] = useState("");

  useEffect(() => {
    const fetchPaymentAgreementData = async () => {
      const data = await getDetailPaymentAgreement(isModalPaymentAgreementOpen.incident_id);
      setPaymentAgreementData(data);
      console.log("Payment Agreement Data", data);
    };
    fetchPaymentAgreementData();
  }, [isModalPaymentAgreementOpen.incident_id]);

  const handleEvidenceClick = (url: string, title: string) => {
    setDownloadUrl(url);
    setDownloadTitle(title);
    setIsDownloadModalOpen(true);
  };

  const columns = [
    {
      title: "ID Factura",
      dataIndex: "idFactura",
      key: "idFactura",
      render: (text: string) => <a>{text}</a>
    },
    {
      title: "Emisión",
      dataIndex: "emision",
      key: "emision"
    },
    {
      title: "Pendiente",
      dataIndex: "pendiente",
      key: "pendiente"
    },
    {
      title: "$ acordado",
      dataIndex: "acordado",
      key: "acordado"
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha"
    }
  ];
  const onSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    // Here you would typically send the data to an API
    onClose();
  };

  const renderSummaryTab = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="agreement-form">
      <div className="form-grid">
        <InputForm titleInput="Responsable" nameInput="responsible" control={control} readOnly />
        <InputForm
          titleInput="Estado del acuerdo"
          nameInput="agreementStatus"
          control={control}
          readOnly
        />
        <InputFormMoney
          titleInput="Valor del acuerdo"
          nameInput="agreementValue"
          control={control}
          readOnly
          error={undefined}
        />
        <InputForm
          titleInput="No. de facturas"
          nameInput="invoicesCount"
          control={control}
          readOnly
        />
        <InputDateForm
          titleInput="Fecha de creación"
          nameInput="creationDate"
          control={control}
          disabled
          error={undefined}
        />
        <InputDateForm
          titleInput="Fecha de vencimiento"
          nameInput="dueDate"
          control={control}
          disabled
          error={undefined}
        />
      </div>
      <div className="evidence-section">
        <Text strong>Evidencia</Text>
        <Controller
          name="evidence"
          control={control}
          render={({ field }) => (
            <div className="evidence-list">
              {field.value.map((item, index) => (
                <div
                  key={index}
                  className="evidence-item"
                  onClick={() => handleEvidenceClick(item.url, item.name)}
                >
                  <PaperclipHorizontal size={20} fill="#000000" className="evidence-icon" />
                  <Flex vertical gap={"4px"}>
                    <Text>{item.name}</Text>
                    <Text className="evidence-time">{item.time}</Text>
                  </Flex>
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </form>
  );
  const renderInvoicesTab = () => (
    <Table
      dataSource={invoicesData}
      columns={columns}
      pagination={false}
      className="invoices-table"
    />
  );

  const items = [
    {
      key: "1",
      label: "Resumen",
      children: renderSummaryTab()
    },
    {
      key: "2",
      label: "Facturas",
      children: renderInvoicesTab()
    }
  ];

  return (
    <>
      <Modal
        width={640}
        open={isModalPaymentAgreementOpen.isOpen}
        title={
          <div className="modal-header">
            <Title level={5} className="modal-title">
              Acuerdo de pago{" "}
              <span className="agreement-id">{isModalPaymentAgreementOpen.incident_id}</span>
            </Title>
          </div>
        }
        footer={null}
        onCancel={onClose}
        className="agreement-detail-modal"
      >
        <UiTab
          tabs={items}
          tabBarExtraContent={
            <div className="modal-actions-dots">
              <DotsThree size={24} weight="bold" />
            </div>
          }
        />
      </Modal>
      <FileDownloadModal
        isModalOpen={isDownloadModalOpen}
        onCloseModal={() => setIsDownloadModalOpen(false)}
        url={downloadUrl}
        title={downloadTitle}
      />
    </>
  );
};
