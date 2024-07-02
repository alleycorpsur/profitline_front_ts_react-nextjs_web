import axios, { AxiosError, AxiosResponse } from "axios";
import config from "@/config";
import { API, getIdToken } from "@/utils/api/api";
import {
  ClientFormType,
  IClient,
  IClientAxios,
  ICreateClient,
  IUpdateClient
} from "@/types/clients/IClients";
import { IBillingPeriodForm } from "@/types/billingPeriod/IBillingPeriod";

import { SUCCESS } from "@/utils/constants/globalConstants";
import { MessageInstance } from "antd/es/message/interface";
import { IAddAddressData } from "@/types/locations/ILocations";
import { GenericResponse } from "@/types/global/IGlobal";

// create

export const createClient = async (
  idProject: string,
  rawData: ClientFormType,
  billingPeriod: IBillingPeriodForm,
  documents: any[],
  locationResponse: IAddAddressData
): Promise<any> => {
  const { infoClient: data } = rawData;

  const formatLocations = JSON.stringify([locationResponse]);

  const formatDocuments = documents.map((doc) => doc.originFileObj);

  const modelData: ICreateClient = {
    nit: parseInt(data.nit),
    project_id: parseInt(idProject),
    client_name: data.client_name,
    business_name: data.business_name,
    phone: data.phone,
    condition_payment: data.condition_payment.value,
    email: data.email,
    radication_type: data.radication_type.value,
    document_type: data.document_type.value,
    locations: formatLocations,
    documents: formatDocuments,
    client_type_id:
      typeof data.client_type === "number" ? data.client_type : parseInt(data.client_type),
    holding_id: data.holding_id?.value === 0 ? undefined : data.holding_id?.value,
    day_flag: typeof billingPeriod === "string" ? undefined : billingPeriod.day_flag === "true",
    day: typeof billingPeriod === "string" ? undefined : billingPeriod.day,
    order: typeof billingPeriod === "string" ? undefined : billingPeriod.order?.toLowerCase(),
    day_of_week:
      typeof billingPeriod === "string" ? undefined : billingPeriod.day_of_week?.toLowerCase()
  };

  const formData = new FormData();
  // Agregar los campos del modelo de datos al objeto FormData
  Object.keys(modelData).forEach((key) => {
    if (key === "documents" && Array.isArray(modelData[key])) {
      modelData[key].forEach((file: File) => {
        formData.append("documents", file);
      });
    } else if (modelData[key] !== undefined && modelData[key] !== null && modelData[key] !== "") {
      formData.append(key, modelData[key]);
    }
  });

  const token = await getIdToken();

  try {
    const response: AxiosResponse | AxiosError = await axios.post(
      `${config.API_HOST}/client`,
      formData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.warn("error creating new client: ", error);
    return error as AxiosError;
  }
};

export const getClientById = async (idUser: string, projectId: string): Promise<IClientAxios> => {
  const token = await getIdToken();
  try {
    const response: IClientAxios = await axios.get(
      `${config.API_HOST}/client/${idUser}/project/${projectId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.warn("error getting client by Id: ", error);
    return error as any;
  }
};

export const updateClient = async (
  idProject: string,
  clientId: number,
  rawData: ClientFormType,
  locationResponse: IAddAddressData | any,
  hasLocationChanged: boolean,
  billingPeriod?: IBillingPeriodForm
): Promise<any> => {
  const { infoClient: data } = rawData;

  const formatLocations = hasLocationChanged
    ? JSON.stringify([locationResponse])
    : JSON.stringify(locationResponse);

  const modelData: IUpdateClient = {
    business_name: data.business_name,
    phone: data.phone,
    condition_payment: data.condition_payment.value,
    email: data.email,
    radication_type: data.radication_type.value,
    document_type: data.document_type.value,
    locations: formatLocations,
    holding_id: data.holding_id.value,
    day_flag: typeof billingPeriod === "string" ? undefined : billingPeriod?.day_flag === "true",
    day: typeof billingPeriod === "string" ? undefined : billingPeriod?.day,
    order: typeof billingPeriod === "string" ? undefined : billingPeriod?.order?.toLowerCase(),
    day_of_week:
      typeof billingPeriod === "string" ? undefined : billingPeriod?.day_of_week?.toLowerCase()
  };

  const formData = new FormData();

  Object.keys(modelData).forEach((key) => {
    if (modelData[key] !== undefined && modelData[key] !== null && modelData[key] !== "") {
      formData.append(key, modelData[key]);
    }
  });

  const token = await getIdToken();
  try {
    const response: AxiosResponse | AxiosError = await axios.put(
      `${config.API_HOST}/client/${clientId}/project/${idProject}`,
      modelData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    console.warn("error updating client: ", error);
    return error as AxiosError;
  }
};

export const deleteClientById = async (
  idUser: number,
  projectId: string,
  messageApi: MessageInstance,
  onClose: () => void
): Promise<IClientAxios> => {
  const token = await getIdToken();
  try {
    const response: IClientAxios = await axios.delete(
      `${config.API_HOST}/client/${idUser}/project/${projectId}`,
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
        content: "El Cliente fue eliminado exitosamente."
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
    console.warn("error deleting client by Id: ", error);
    return error as any;
  }
};

type PropsGetAllByProject = {
  idProject: string;
  city?: number[];
  holding?: number[];
  risk?: number[];
  payment_condition?: number[];
  radication_type?: number[];
  status?: number[];
};
export const getAllByProject = async (props: PropsGetAllByProject): Promise<IClient[]> => {
  const { city, holding, risk, payment_condition, radication_type, status, idProject } = props;
  const response: GenericResponse<IClient[]> = await API.get(`/client/project/${idProject}`, {
    params: {
      city,
      holding,
      risk,
      payment_condition,
      radication_type,
      status
    }
  });
  return response?.data;
};
