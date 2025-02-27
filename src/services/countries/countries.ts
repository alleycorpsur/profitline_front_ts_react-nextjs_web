import config from "@/config";
import { Datum } from "@/types/countries/IListCountries";
import { GenericResponse } from "@/types/global/IGlobal";
import { API } from "@/utils/api/api";

export const getAllCountries = async (): Promise<Datum[]> => {
  try {
    const response: GenericResponse<Datum[]> = await API.get(`${config.API_HOST}/country`);
    return response.data;
  } catch (error) {
    return error as any;
  }
};
