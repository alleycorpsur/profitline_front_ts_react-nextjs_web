import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { SUCCESS } from "@/utils/constants/globalConstants";
import { MessageInstance } from "antd/es/message/interface";
import axios, { AxiosResponse } from "axios";

export const onCreateGroupClient = async (
  data: { name: string; clients: string[] },
  messageApi: MessageInstance,
  onClose: () => void
) => {
  const modelData = {
    name: data.name,
    clients: data.clients.map((client) => client.toString())
  };
  const token = await getIdToken();
  try {
    const response: AxiosResponse = await axios.post(`${config.API_HOST}/group-client`, modelData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === SUCCESS) {
      messageApi.open({
        type: "success",
        content: `El grupo de cliente ${data.name} fue creado exitosamente.`
      });
      onClose();
    } else {
      messageApi.open({
        type: "error",
        content: "Oops ocurrio un error."
      });
      onClose();
    }

    return response;
  } catch (error) {
    return error as any;
  }
};
