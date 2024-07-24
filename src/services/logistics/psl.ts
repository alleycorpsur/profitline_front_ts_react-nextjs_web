import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { IListData } from "@/types/logistics/schema";

export const getPsl = async (): Promise<IListData> => {
    const token = await getIdToken();
    try {
        const response: IListData = await axios.get(`${config.API_HOST}/transfer-order/all/psl`, {
        headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.log("Error get all other psl: ", error);
        return error as any;
    }
};
      