import axios, { AxiosResponse } from "axios";

import { getIdToken } from "@/utils/api/api";
import config from "@/config";
import { ICreateRegister, IListData, ITransferOrder, TransferOrderDocumentType } from "@/types/logistics/schema";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";

export const addTransferOrder = async (
    data: ITransferOrder,
    files: DocumentCompleteType[]
  ): Promise<AxiosResponse<any, any>> => {
    try {
      const token = await getIdToken();
      const form = new FormData();
      const body: any = data;
      body.files = files;
      files.forEach((file) => {
        if (file.file)
          form.append(`file-for-${file.id}`, file.file);
      });
      form.append("body", JSON.stringify({...body}));
      const response = await axios.post(`${config.API_HOST}/transfer-order/create`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log("Error post transfer-order/: ", error);
      throw error as any;
    }
  };

  export const getAllTransferOrderList = async (): Promise<IListData> => {
    const token = await getIdToken();
    try {
      const response: IListData = await axios.get(`${config.API_HOST}/transfer-order/list`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log("Error get all getAllTransferOrderList: ", error);
      return error as any;
    }
  };
  
  export const getTransferOrderById = async (id: string): Promise<IListData> => {
    const token = await getIdToken();
    try {
      const form = new FormData();      
      form.append("id", id);

      const response: IListData = await axios.post(
        `${config.API_HOST}/transfer-order/id`, form,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${token}`
          }
        }
      );
 
      return response;
    } catch (error) {
      console.log("Error getTransferOrderById: ", error);
      return error as any;
    }
  };