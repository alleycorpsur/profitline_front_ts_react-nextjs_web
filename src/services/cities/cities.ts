import config from "@/config";
import { Icities } from "@/types/cities/Icities";

import { getIdToken } from "@/utils/api/api";
import axios from "axios";

export const getAllCities = async (): Promise<Icities> => {
  const token = await getIdToken();
  try {
    const response: Icities = await axios.get(`${config.API_HOST}/location`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return error as any;
  }
};
