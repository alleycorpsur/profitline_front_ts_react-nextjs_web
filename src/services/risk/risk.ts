import axios from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { IRisk } from "@/types/risk/IRisk";

export const getAllRisks = async (): Promise<IRisk> => {
  const token = await getIdToken();
  try {
    const response: IRisk = await axios.get(`${config.API_HOST}/risk`, {
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
