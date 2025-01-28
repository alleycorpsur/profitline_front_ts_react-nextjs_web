import axios from "axios";
import config from "@/config";
import { API, getIdToken } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { InvoicesData } from "@/types/invoices/IInvoices";

export const addItemsToTable = async (
  project_id: number,
  client_id: number,
  adding_type: "invoices" | "payments" | "discounts",
  selected_items_ids: number[]
) => {
  const modelData = {
    project_id,
    client_id,
    ...(adding_type === "invoices" && { invoice_ids: selected_items_ids }),
    ...(adding_type === "payments" && { payment_ids: selected_items_ids }),
    ...(adding_type === "discounts" && { discount_ids: selected_items_ids })
  };
  try {
    const response: GenericResponse<{ applications: number[] }> = await API.post(
      `${config.API_HOST}/paymentApplication/applications/batch`,
      modelData
    );

    return response.data;
  } catch (error) {
    console.error("error addItemsToTable", error);
    throw error;
  }
};

export const removeItemsFromTable = async (row_id: number) => {
  try {
    const response: GenericResponse<{ applications: number[] }> = await API.delete(
      `${config.API_HOST}/paymentApplication/applications/${row_id}`
    );

    return response.data;
  } catch (error) {
    console.error("error removeItemsFromTable", error);
    throw error;
  }
};

interface ICreateGlobalAdjustment {
  amount: number;
  motive: number;
  description: string;
}

export const createGlobalAdjustment = async (
  project_id: number,
  client_id: number,
  adjustments: ICreateGlobalAdjustment[]
) => {
  const modelData = {
    project_id,
    client_id,
    discounts: adjustments
  };

  try {
    const response: GenericResponse<{ applications: number[] }> = await API.post(
      `${config.API_HOST}/paymentApplication/applications/bulk-discounts`,
      modelData
    );

    return response.data;
  } catch (error) {
    console.error("error addItemsToTable", error);
    throw error;
  }
};

interface IDiscount {
  id: number;
  balanceToApply: number;
}

interface IAdjustmentData {
  invoice_id: number;
  discounts: IDiscount[];
}

interface ISpecificAdjustment {
  adjustment_data: IAdjustmentData[];
  type: number;
}

export const addSpecificAdjustments = async (
  project_id: number,
  client_id: string,
  data: ISpecificAdjustment
) => {
  const token = await getIdToken();
  const formData = new FormData();

  for (const key in data) {
    formData.append(key, JSON.stringify(data[key as keyof ISpecificAdjustment]));
  }

  try {
    const response: GenericResponse<{ applications: number[] }> = await axios.post(
      `${config.API_HOST}/paymentApplication/projects/${project_id}/clients/${client_id}/adjustments`,
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
  } catch (error) {
    console.error("error addSpecificAdjustments", error);
    throw error;
  }
};

export const saveApplication = async (project_id: number, client_id: number) => {
  const modelData = {
    project_id,
    client_id
  };
  try {
    const response: GenericResponse<{ applications: number[] }> = await API.post(
      `${config.API_HOST}/paymentApplication/save-current-application`,
      modelData
    );

    return response.data;
  } catch (error) {
    console.error("error saveApplication", error);
    throw error;
  }
};

export const getApplicationInvoices = async (project_id: number, client_id: number) => {
  try {
    const response: GenericResponse<InvoicesData[]> = await API.get(
      `${config.API_HOST}/paymentApplication/client/${client_id}/project/${project_id}?page=1&limit=50`
    );

    return response.data;
  } catch (error) {
    console.error("error getApplicationInvoices", error);
    throw error;
  }
};
