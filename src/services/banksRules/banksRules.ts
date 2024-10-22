import { GenericResponse } from "@/types/global/IGlobal";
import config from "@/config";
import { API } from "@/utils/api/api";
import { IPostRule } from "@/types/banks/IBanks";

export const createBankRule = async (rule: IPostRule) => {
  try {
    const response: GenericResponse<any> = await API.post(`${config.API_HOST}/bank-rule`, rule);

    return response.data;
  } catch (error) {
    console.error("Error al crear la regla:", error);
    throw error;
  }
};
