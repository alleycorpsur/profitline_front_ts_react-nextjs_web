import config from "@/config";
import { DiscountRequestBody } from "@/types/accountingAdjustment/IAccountingAdjustment";
import { API, getIdToken } from "@/utils/api/api";
import axios, { AxiosResponse } from "axios";

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
    return error as any;
  }
};
export const applyAccountingAdjustment = async (
  adjustmentData: string,
  docFiles: File[] | null,
  projectId: string,
  clientId: string
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  const formData = new FormData();
  formData.append("adjustment_data", adjustmentData);
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
