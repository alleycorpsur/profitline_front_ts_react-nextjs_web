import { API } from "@/utils/api/api";
import { SUCCESS } from "@/utils/constants/globalConstants";
import { MessageInstance } from "antd/es/message/interface";
import { AxiosResponse } from "axios";

export const transferOrderMerge = async (orders: number[], messageApi: MessageInstance) => {
  try {
    const response: AxiosResponse = await API.post(`/transfer-order/merge`, orders);
    if (response.status === SUCCESS) {
      messageApi.open({
        type: "success",
        content: "Ordenes de transferencia agrupadas."
      });
    } else if (response.data === null) {
      messageApi.open({
        type: "error",
        content: "Una de las ordenes no tiene un viaje."
      });
    } else {
      messageApi.open({
        type: "error",
        content: `Ordenes de transferencia ${orders.map(a => a)} ya fueron usadas`
      });
    }
    return response;
  } catch (error) {
    return error as any;
  }
};
