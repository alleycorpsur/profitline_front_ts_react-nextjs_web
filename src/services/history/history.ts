import config from "@/config";
import { IHistoryCommunicationDetail } from "@/types/clientHistory/IClientHistory";
import { GenericResponse } from "@/types/global/IGlobal";
import { API } from "@/utils/api/api";

export const getCommunicationDetail = async (
  mongo_id: string
): Promise<IHistoryCommunicationDetail> => {
  try {
    const response: GenericResponse<IHistoryCommunicationDetail> = await API.get(
      `${config.API_HOST}/comunication/detail-sendend/${mongo_id}`
    );
    return response.data;
  } catch (error) {
    return error as any;
  }
};
