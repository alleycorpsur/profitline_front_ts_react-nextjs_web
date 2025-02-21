import config from "@/config";
import { API } from "@/utils/api/api";
import { IDataSection } from "@/types/portfolios/IPortfolios";

export const getPortfolioFromClient = async (
  projectId: number | undefined,
  clientId: number | undefined
): Promise<any> => {
  try {
    const response = await API.get(
      `${config.API_HOST}/portfolio/project/${projectId}/client/${clientId}`
    );
    return response.data as IDataSection;
  } catch (error) {
    console.warn("error getting client portfolio", error);
    return error as any;
  }
};

export const getProjectPortfolio = async (projectId: number): Promise<any> => {
  try {
    const response = await API.get(`/portfolio/project/all/${projectId}/client`);
    return response.data as IDataSection;
  } catch (error) {
    console.warn("error getting project portfolio", error);
    throw error;
  }
};
