import config from "@/config";
import { ITypeRadications } from "@/types/typeRadications/typeRadications";
import { getIdToken } from "@/utils/api/api";
import axios from "axios";

export const getAllRadicationTypes = async (): Promise<ITypeRadications> => {
  const token = await getIdToken();
  try {
    const response: ITypeRadications = await axios.get(
      `${config.API_HOST}/client/radication-types`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    return error as any;
  }
};
