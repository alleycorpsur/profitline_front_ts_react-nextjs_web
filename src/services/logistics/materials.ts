import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { IListData } from "@/types/logistics/schema";

export const getSearchMaterials = async (term:string): Promise<IListData> => {
  const token = await getIdToken();
  try {
    const formData = new FormData();
    formData.append("term", term);
    const response: IListData = await axios.post(`${config.API_HOST}/material/search`, formData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.log("Error creating new location: ", error);
    return error as any;
  }
};

export const getAllMaterials = async (): Promise<IListData> => {
  const token = await getIdToken();
  try {
    const response: IListData = await axios.get(`${config.API_HOST}/material/all`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.log("Error get all materials: ", error);
    return error as any;
  }
};