import { GenericResponse } from "@/types/global/IGlobal";
import axios from "axios";
import config from "@/config";
import { API, getIdToken } from "@/utils/api/api";
import { IClientsByProject, ISingleBank } from "@/types/banks/IBanks";

export const getPaymentDetail = async (payment_id: number) => {
  try {
    const response: GenericResponse<ISingleBank[]> = await API.get(
      `/bank/get-payment-detail?payment_id=${payment_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener el detalle del pago:", error);
    return [];
  }
};

export const getClientsByProject = async (project_id: number) => {
  try {
    const response: GenericResponse<IClientsByProject[]> = await API.get(
      `/client/get-client-by-project?project_id=${project_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return [];
  }
};

interface IAssignClient {
  id_user: number;
  payment_ids: number[];
  client_id: string;
  evidence: File;
}
export const assignClient = async ({
  id_user,
  payment_ids,
  client_id,
  evidence
}: IAssignClient) => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("id_user", id_user.toString());
  formData.append("payment_ids", JSON.stringify(payment_ids));
  formData.append("assign_client_id", client_id);
  formData.append("evidence", evidence);
  try {
    const response: GenericResponse<any> = await axios.put(
      `${config.API_HOST}/bank/assign-client-payments`,
      formData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al asignar el cliente al pago:", error);
    throw error;
  }
};

export const editClient = async ({ id_user, payment_ids, client_id, evidence }: IAssignClient) => {
  const token = await getIdToken();

  const formData = new FormData();
  formData.append("id_user", id_user.toString());
  formData.append("payment_ids", JSON.stringify(payment_ids));
  formData.append("assign_client_id", client_id);
  formData.append("evidence", evidence);
  try {
    const response: GenericResponse<any> = await axios.put(
      `${config.API_HOST}/bank/updated-client-payments`,
      formData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al editar el cliente:", error);
    throw error;
  }
};
