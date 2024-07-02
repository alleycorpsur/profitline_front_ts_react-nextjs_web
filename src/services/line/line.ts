import { API } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { ILine } from "@/types/lines/line";

export const getAllLinesByProject = async (idProject: string) => {
  const response: GenericResponse<ILine[]> = await API.get(`/line/project/${idProject}`);
  return response?.data || [];
};
