import config from "@/config";
import { API } from "@/utils/api/api";
import { IDataSection } from "@/types/portfolios/IPortfolios";
import { GenericResponse } from "@/types/global/IGlobal";

export const getPortfolioFromClient = async (
  projectId: number | undefined,
  clientId: number | undefined
): Promise<any> => {
  try {
    const response: GenericResponse<IDataSection> = await API.get(
      `${config.API_HOST}/portfolio/project/${projectId}/client/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.warn("error getting client portfolio", error);
    return error as any;
  }
};

export const getProjectPortfolio = async (projectId: number): Promise<any> => {
  try {
    const response: GenericResponse<IDataSection> = await API.get(
      `${config.API_HOST}/portfolio/project/all/${projectId}/client`
    );
    return response.data;
  } catch (error) {
    console.warn("error getting project portfolio", error);
    throw error;
  }
};
