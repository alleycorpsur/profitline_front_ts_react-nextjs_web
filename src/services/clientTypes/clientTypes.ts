import config from "@/config";
import { ItypeClients } from "@/types/typeClients/ItypeClients";
import { getIdToken } from "@/utils/api/api";
import axios from "axios";

export const getAllClientTypes = async (): Promise<ItypeClients> => {
  const token = await getIdToken();
  try {
    const response: ItypeClients = await axios.get(`${config.API_HOST}/client/types`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);

    return response;
  } catch (error) {
    return error as any;
  }
};
