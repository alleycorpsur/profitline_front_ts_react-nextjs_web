import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { CREATED, SUCCESS } from "@/utils/constants/globalConstants";
import { MessageInstance } from "antd/es/message/interface";
import axios, { AxiosResponse } from "axios";

export const addHolding = async ({
  name,
  messageApi
}: {
  name: string;
  messageApi: MessageInstance;
}): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${config.API_HOST}/holding`,
      { name },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === CREATED) {
      messageApi.open({
        type: "success",
        content: `El holding fue creado exitosamente.`
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Oops ocurrio un error."
      });
    }
    console.log(response);

    return response;
  } catch (error) {
    return error as any;
  }
};

export const removeHoldingById = async ({
  idHolding,
  messageApi
}: {
  idHolding: string;
  messageApi: MessageInstance;
}): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${config.API_HOST}/holding/${idHolding}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === SUCCESS) {
      messageApi.open({
        type: "success",
        content: `El holding fue eliminado exitosamente.`
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Oops ocurrio un error."
      });
    }

    return response;
  } catch (error) {
    return error as any;
  }
};
