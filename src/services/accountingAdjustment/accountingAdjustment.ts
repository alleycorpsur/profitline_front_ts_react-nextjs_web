import { IFormDigitalRecordModal } from "@/components/molecules/modals/DigitalRecordModal/DigitalRecordModal";
import config from "@/config";
import { DiscountRequestBody } from "@/types/accountingAdjustment/IAccountingAdjustment";
import { GenericResponse } from "@/types/global/IGlobal";
import { API, getIdToken } from "@/utils/api/api";
import axios, { AxiosResponse } from "axios";

interface RadicationData {
  invoices_id: number[];
  radication_type: string;
  accept_date: string;
  comments: string;
}
interface AdjustmentData {
  invoice_id: number;
  date_agreement: string;
  amount: number;
  comment: string;
}

export const createAccountingAdjustment = async (
  requestBody: DiscountRequestBody
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<any> = await API.post(
      `${config.API_HOST}/financial-discount/project/${requestBody.project_id}/client/${requestBody.client_id}`,
      requestBody,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const applyAccountingAdjustment = async (
  adjustmentData: string,
  docFiles: File[] | null,
  projectId: string,
  clientId: string,
  type: number,
  comment: string | undefined
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  const formData = new FormData();
  formData.append("adjustment_data", adjustmentData);
  formData.append("type", type.toString());
  if (comment) formData.append("comment", comment);
  if (docFiles) {
    docFiles.forEach((file) => {
      formData.append("doc", file);
    });
  }

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/adjusment/project/${projectId}/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const changeStatusInvoice = async (
  statusName: string,
  invoiceIds: number[],
  comments: string,
  docFiles: File[] | null,
  projectId: number,
  clientId: number
): Promise<
  AxiosResponse<{
    message: string;
    data: any;
  }>
> => {
  const token = await getIdToken();
  const formData = new FormData();
  formData.append("status_name", statusName);
  formData.append("invoice_ids", JSON.stringify(invoiceIds));
  formData.append("comments", comments);
  if (docFiles) {
    docFiles.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response: AxiosResponse<{
    message: string;
    data: any;
  }> = await axios.post(
    `${config.API_HOST}/invoice/project/${projectId}/client/${clientId}/update_status`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response;
};

export const reportInvoiceIncident = async (
  invoicesId: number[],
  comments: string,
  motiveId: string,
  files: File[] | null,
  clientId: string,
  amount?: string
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("invoices_id", JSON.stringify(invoicesId));
  formData.append("comments", comments);
  formData.append("motive_id", motiveId);
  if (amount) formData.append("amount", amount);

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/incident/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const radicateInvoice = async (
  radicationData: RadicationData,
  files: File[],
  clientId: number
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("invoices_id", JSON.stringify(radicationData.invoices_id));
  formData.append("radication_type", radicationData.radication_type);
  formData.append("accept_date", radicationData.accept_date);
  formData.append("comments", radicationData.comments);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/radication/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const createPaymentAgreement = async (
  projectId: number,
  clientId: string,
  adjustmentData: AdjustmentData[],
  file: File | null
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("adjustment_data", JSON.stringify(adjustmentData));

  if (file) {
    formData.append("file", file);
  }

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/invoice/paymentAgreement/project/${projectId}/client/${clientId}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const legalizeFinancialDiscount = async (
  discountData: {
    discount_id_legalized: number;
    discount_id_not_legalized: number;
  },
  projectId: number,
  clientId: number
): Promise<GenericResponse> => {
  const response: GenericResponse = await API.post(
    `${config.API_HOST}/financial-discount/legalize/project/${projectId}/client/${clientId}`,
    discountData
  );

  return response;
};

interface User {
  label: string;
  value: string;
}

interface DigitalRecordResponse {
  usuarios: User[];
  asunto: string;
}

export const getDigitalRecordFormInfo = async (
  projectId: number
): Promise<DigitalRecordResponse> => {
  const token = await getIdToken();

  try {
    const response: AxiosResponse<DigitalRecordResponse> = await axios.get(
      `${config.API_HOST}/client/digital-record?projectId=${projectId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting digital record form info", error);
    throw error;
  }
};

export const createDigitalRecord = async (
  data: IFormDigitalRecordModal,
  invoicesIds: number[],
  project_id: number,
  user_id: string
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const forward_to = data.forward_to.map((user) => user.value);
  const copy_to = data?.copy_to?.map((user) => user.value);

  const formData = new FormData();

  formData.append("invoice_ids", JSON.stringify(invoicesIds));
  formData.append("forward_to", JSON.stringify(forward_to));
  if (copy_to) formData.append("copy_to", JSON.stringify(copy_to));
  formData.append("subject", data.subject);
  formData.append("commentary", data.comment);
  formData.append("user_id", user_id);
  data.attachments.forEach((file) => {
    formData.append("attachments", file);
  });

  const response: AxiosResponse<any> = await axios.post(
    `${config.API_HOST}/client/digital-record?projectId=${project_id}`,
    formData,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response;
};
