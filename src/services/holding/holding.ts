import config from "@/config";
import { GenericResponse } from "@/types/global/IGlobal";
import { API, getIdToken } from "@/utils/api/api";
import { CREATED, SUCCESS } from "@/utils/constants/globalConstants";
import { MessageInstance } from "antd/es/message/interface";

export const addHolding = async ({
  name,
  projectId,
  messageApi
}: {
  name: string;
  projectId: number;
  messageApi: MessageInstance;
}): Promise<any> => {
  try {
    const response = await API.post(`/holding`, {
      name,
      project_id: projectId
    });
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
}): Promise<any> => {
  const token = await getIdToken();
  try {
    const response = await API.delete(`${config.API_HOST}/holding/${idHolding}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
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

export const getHoldingsByProjectId = async (
  projectId: number
): Promise<
  {
    id: number;
    name: string;
  }[]
> => {
  try {
    const response: GenericResponse<{ id: number; name: string }[]> = await API.get(
      `${config.API_HOST}/holding/project/${projectId}`
    );
    return response.data;
  } catch (error) {
    return error as any;
  }
};
