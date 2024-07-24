import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { IListData } from "@/types/logistics/schema";

export const getSubsidiaries = async (): Promise<IListData> => {
    const token = await getIdToken();
    try {
        const response: IListData = await axios.get(`${config.API_HOST}/transfer-order/all/subsidiaries`, {
        headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.log("Error get all other subsidiaries: ", error);
        return error as any;
    }
};
      