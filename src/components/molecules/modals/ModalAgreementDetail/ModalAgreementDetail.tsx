import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Flex, MenuProps } from "antd";
import { useForm, Controller } from "react-hook-form";
import { Paperclip } from "phosphor-react";
import dayjs from "dayjs";

import {
  cancelPaymentAgreement,
  getDetailPaymentAgreement
} from "@/services/accountingAdjustment/accountingAdjustment";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";
import UiTab from "@/components/ui/ui-tab";
import { FileDownloadModal } from "../FileDownloadModal/FileDownloadModal";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";

import { IPaymentDetail } from "@/types/paymentAgreement/IPaymentAgreement";

import "./modalAgreementDetail.scss";
import { useMessageApi } from "@/context/MessageContext";

interface Props {
  isModalPaymentAgreementOpen: {
    isOpen: boolean;
    incident_id: number;
  };
  onClose: () => void;
}

interface FormData {
  responsible: string;
  agreementValue: string;
  creationDate: dayjs.Dayjs;
  evidence: string[];
  agreementStatus: string;
  invoicesCount: string;
  dueDate: dayjs.Dayjs;
}

export const ModalAgreementDetail: React.FC<Props> = ({ isModalPaymentAgreementOpen, onClose }) => {
  const [paymentAgreementData, setPaymentAgreementData] = useState<IPaymentDetail>();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadTitle, setDownloadTitle] = useState("");

  const { showMessage } = useMessageApi();

  const { control, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (!isModalPaymentAgreementOpen.incident_id) return;
    const fetchPaymentAgreementData = async () => {
      try {
        const data = await getDetailPaymentAgreement(isModalPaymentAgreementOpen.incident_id);
        setPaymentAgreementData(data);
        reset(dataToFormData(data));
      } catch (error) {
        console.error("Error getting payment agreement detail", error);
      }
    };
    fetchPaymentAgreementData();
  }, [isModalPaymentAgreementOpen.incident_id]);

  const handleEvidenceClick = (url: string) => {
    setDownloadUrl(url);
    const title = url.split("/").pop();
    setDownloadTitle(title || url);
    setIsDownloadModalOpen(true);
  };

  const columns = [
    {
      title: "ID Factura",
      dataIndex: "invoice_id",
      key: "invoice_id",
      render: (text: string) => <a>{text}</a>
    },
    {
      title: "Emisión",
      dataIndex: "CREATE_AT",
      key: "CREATE_AT"
    },
    {
      title: "Pendiente",
      dataIndex: "pendiente",
      key: "pendiente"
    },
    {
      title: "$ acordado",
      dataIndex: "amount",
      key: "amount"
    },
    {
      title: "Fecha",
      dataIndex: "payment_date",
      key: "payment_date"
    }
  ];
  const onSubmit = (data: FormData) => {
    console.info("Form submitted with data:", data);
    // Here you would typically send the data to an API
    onClose();
  };

  const handleCancelAgreement = async () => {
    if (paymentAgreementData?.status_name === "Anulada") {
      showMessage("error", "El acuerdo ya se encuentra anulado");
      return;
    }
    try {
      await cancelPaymentAgreement(isModalPaymentAgreementOpen.incident_id);
      onClose();
    } catch (error) {
      showMessage("error", "Error al anular el acuerdo");
    }
  };

  const itemsDropDown: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button className="buttonOutlined" onClick={handleCancelAgreement}>
          Anular acuerdo
        </Button>
      )
    }
  ];

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
          error={undefined}
          readOnly
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
      <div className="evidenceSection">
        <p className="evidenceSection__title">Evidencia</p>
        <Controller
          name="evidence"
          control={control}
          render={({ field }) => (
            <div className="evidence-list">
              {field?.value?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="evidence-item"
                    onClick={() => handleEvidenceClick(item)}
                  >
                    <Paperclip size={36} className="evidence-icon" />
                    <Flex vertical gap={"4px"}>
                      <p>{item.split("/").pop()}</p>
                    </Flex>
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>
    </form>
  );

  const renderInvoicesTab = () => (
    <Table
      dataSource={paymentAgreementData?.agreement_invoices}
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
            <div className="agreement-detail-modal__modal-title">
              Acuerdo de pago{" "}
              <span className="agreement-id">{isModalPaymentAgreementOpen.incident_id}</span>
            </div>
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
              <DotsDropdown items={itemsDropDown} />
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

const dataToFormData = (data: IPaymentDetail): FormData => {
  return {
    responsible: data.user_name,
    agreementValue: data.amount.toString(),
    creationDate: dayjs(data.created_at),
    evidence: data.files,
    agreementStatus: data.status_name,
    invoicesCount: data.count_invoices.toString(),
    dueDate: dayjs(data.payment_date)
  };
};
