import { GenericResponse } from "@/types/global/IGlobal";
import config from "@/config";
import { API } from "@/utils/api/api";
import { IApplyTabClients } from "@/types/applyTabClients/IApplyTabClients";

// Hacerlo en SWR para poder usar mutate
export const getApplication = async (
  project_id: number,
  client_id: number
): Promise<IApplyTabClients> => {
  try {
    const response: GenericResponse<IApplyTabClients> = await API.get(
      `${config.API_HOST}/paymentApplication/applications/?project_id=${project_id}&client_id=${client_id}`
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

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
