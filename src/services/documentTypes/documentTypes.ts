import config from "@/config";
import { typeDocuments } from "@/types/typeDocuments/typeDocuments";
import { getIdToken } from "@/utils/api/api";
import axios from "axios";

export const getAllDocumentTypes = async (): Promise<typeDocuments> => {
  const token = await getIdToken();
  try {
    const response: typeDocuments = await axios.get(`${config.API_HOST}/document-type/`, {
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
