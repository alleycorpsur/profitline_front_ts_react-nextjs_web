import config from "@/config";
import { GenericResponse } from "@/types/global/IGlobal";
import { IRol } from "@/types/roles/IRoles";
import { API } from "@/utils/api/api";

export const getAllRoles = async (): Promise<IRol[]> => {
  try {
    const response: GenericResponse<IRol[]> = await API.get(`${config.API_HOST}/role`);
    return response.data;
  } catch (error) {
    return error as any;
  }
};
