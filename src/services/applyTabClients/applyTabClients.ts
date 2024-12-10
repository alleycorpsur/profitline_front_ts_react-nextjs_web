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
