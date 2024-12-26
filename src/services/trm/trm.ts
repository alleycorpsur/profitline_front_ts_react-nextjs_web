import config from "@/config";
import { GenericResponse } from "@/types/global/IGlobal";
import { TRMRow } from "@/types/trm";
import { API } from "@/utils/api/api";

export const getTRMList = async (projectId: number) => {
  const response: GenericResponse<TRMRow[]> = await API.get(
    `${config.API_HOST}/comunication/?project_id=${projectId}`
  );
  if (response.success) return response.data;
  else return [];
};
