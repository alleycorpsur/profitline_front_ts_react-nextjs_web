import config from "@/config";
import {
  CreateIncidentResponse,
  dataConcilation,
  IInvoiceIncident
} from "@/types/concilation/concilation";
import { GenericResponse } from "@/types/global/IGlobal";
import { API } from "@/utils/api/api";

export const invoiceConciliation = async (files: File[], clientId: number, projectId: number) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("client_id", clientId.toString());
  formData.append("project_id", projectId.toString());

  const response: GenericResponse<dataConcilation> = await API.post(
    `${config.API_HOST}/massive-action/invoice-conciliation`,
    formData
  );

  return response.data;
};

export const invoiceCreateIncident = async (
  files: File[],
  invoices: IInvoiceIncident[],
  comments: string,
  clientId: number
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("invoices", JSON.stringify(invoices));
  formData.append("comments", comments);
  formData.append("client_id", clientId.toString());

  const response: GenericResponse<CreateIncidentResponse> = await API.post(
    `${config.API_HOST}/massive-action/invoice-create-incident`,
    formData
  );

  return response;
};
