import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { IDataSection } from "@/types/portfolios/IPortfolios";

export const getPortfolioFromClient = async (
  projectId: number | undefined,
  clientId: number | undefined
): Promise<any> => {
  const token = await getIdToken();

  try {
    const response: AxiosResponse = await axios.get(
      `${config.API_HOST}/portfolio/project/${projectId}/client/${clientId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data as IDataSection;
  } catch (error) {
    console.warn("error getting client portfolio", error);
    return error as any;
  }
};

export const getProjectPortfolio = async (projectId: number): Promise<any> => {
  const token = await getIdToken();

  try {
    const response: AxiosResponse = await axios.get(
      `${config.API_HOST}/portfolio/project/all/${projectId}/client`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data as IDataSection;
  } catch (error) {
    console.warn("error getting project portfolio", error);
    return error as any;
  }
};
