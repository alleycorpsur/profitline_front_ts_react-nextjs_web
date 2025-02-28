import config from "@/config";
import { Datum } from "@/types/currencies/IListCurrencies";
import { API } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";

export const getAllCurrencies = async (): Promise<Datum[]> => {
  try {
    const response: GenericResponse<Datum[]> = await API.get(`${config.API_HOST}/currency`);
    return response.data;
  } catch (error) {
    return error as any;
  }
};
