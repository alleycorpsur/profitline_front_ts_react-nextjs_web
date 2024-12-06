import config from "@/config";
import axios, { AxiosResponse } from "axios";

import { API, getIdToken } from "@/utils/api/api";
import { MessageType } from "@/context/MessageContext";

import { ISelectedBussinessRules } from "@/types/bre/IBRE";
import {
  ICommunication,
  ICommunicationForm,
  ICreateCommunication,
  IPeriodicityModalForm,
  ISingleCommunication
} from "@/types/communications/ICommunications";
import { GenericResponse } from "@/types/global/IGlobal";

interface IGetSelect {
  id: number;
  name: string;
}

export const getAllCommunications = async (projectId: number) => {
  const response: ICommunication[] = await API.get(
    `${config.API_HOST}/comunication/?project_id=${projectId}`
  );
  return response;
};

export const getCommunicationById = async (
  communicationId: number
): Promise<ISingleCommunication | null> => {
  try {
    const response: AxiosResponse<ISingleCommunication> = await API.get(
      `${config.API_HOST}/comunication/detail_comunicaction?comunication_consolidated_id=${communicationId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error getting communication by id. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error getting communication by id", error);
    return null;
  }
};

export const getForwardEvents = async (): Promise<IGetSelect[]> => {
  const response: IGetSelect[] = await API.get(`${config.API_HOST}/comunication/events`);
  return response;
};

export const getActions = async (): Promise<IGetSelect[]> => {
  const response: IGetSelect[] = await API.get(`${config.API_HOST}/comunication/actions`);
  return response;
};

export const getSubActions = async (action_ids: string[]): Promise<IGetSelect[]> => {
  const response: IGetSelect[] = await API.get(
    `${config.API_HOST}/comunication/actions/${action_ids[0]}/sub-actions`
  );
  return response;
};

interface IGetTags extends IGetSelect {
  description: string;
}

export const getTemplateTags = async (): Promise<IGetTags[]> => {
  const response: GenericResponse<IGetTags[]> = await API.get(
    `${config.API_HOST}/comunication/tags`
  );
  return response.data;
};

export const getForwardToEmails = async (): Promise<string[]> => {
  const response: string[] = await API.get(`${config.API_HOST}/comunication/get_emails`);
  return response;
};

interface ICreateCommunicationProps {
  data: ICommunicationForm;
  selectedPeriodicity: IPeriodicityModalForm | undefined;
  zones: number[];
  selectedBusinessRules: ISelectedBussinessRules;
  assignedGroups: number[];
  projectId: number;
  // eslint-disable-next-line no-unused-vars
  showMessage: (type: MessageType, content: string) => void;
}

export const createCommunication = async ({
  data,
  selectedPeriodicity,
  zones,
  selectedBusinessRules,
  assignedGroups,
  projectId,
  showMessage
}: ICreateCommunicationProps) => {
  const token = await getIdToken();
  const eventTriggerDays = data?.trigger?.settings?.noticeDaysEvent;

  const sendToRoles = data.template.send_to
    .filter((role) => {
      const isRole = role.value.split("_")[0];
      return isRole !== "0";
    })
    .map((role) => Number(role.value.split("_")[1]));
  const copyToRoles =
    data.template.copy_to
      ?.filter((role) => {
        const isRole = role.value.split("_")[0];
        return isRole !== "0";
      })
      .map((role) => Number(role.value.split("_")[1])) || [];
  const roles_ids = [...sendToRoles, ...copyToRoles];

  const sendToContactPositions = data.template.send_to
    .filter((role) => {
      const isContactPos = role.value.split("_")[0];
      return isContactPos === "0";
    })
    .map((role) => Number(role.value.split("_")[1]));
  const copyToContactPositions =
    data.template.copy_to
      ?.filter((role) => {
        const isContactPos = role.value.split("_")[0];
        return isContactPos === "0";
      })
      .map((role) => Number(role.value.split("_")[1])) || [];
  const contact_positions_ids = [...sendToContactPositions, ...copyToContactPositions];

  const jsonFreq = {
    start_date: selectedPeriodicity?.init_date?.format("YYYY-MM-DD") || "",
    repeat: {
      interval: selectedPeriodicity?.frequency_number || 0,
      frequency: selectedPeriodicity?.frequency.value || "mensual",
      day: selectedPeriodicity?.init_date?.format("YYYY-MM-DD").split("-")[2] || ""
    },
    end_date: selectedPeriodicity?.end_date?.format("YYYY-MM-DD") || ""
  };

  const modelData: ICreateCommunication = {
    // Where does invoice should come from?
    project_id: projectId,
    name: data.name,
    description: data.description,
    subject: data.template.subject,
    message: data.template.message,
    via: data.template.via.value.toLowerCase(),
    user_roles: roles_ids,
    contact_roles: contact_positions_ids,
    client_group_ids: assignedGroups,
    comunication_type: data.trigger.type,
    // Frequency-specific properties (optional)
    json_frecuency: data.trigger.type === 1 ? jsonFreq && jsonFreq : undefined,

    // Event-specific properties (optional)
    id_event_type: Number(data.trigger.settings?.event_type?.value) || undefined,
    delay_event: Number(eventTriggerDays) || undefined,

    // Action-specific properties (optional)
    action_type_ids:
      data.trigger.settings?.actions?.map((action) => Number(action.value)) || undefined,
    sub_action_type_ids:
      data.trigger.settings?.subActions?.map((subAction) => Number(subAction.value)) || undefined
  };

  try {
    const response: GenericResponse<{ id: number }> = await axios.post(
      `${config.API_HOST}/comunication`,
      modelData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) showMessage("success", "Comunicación creada correctamente");
    return response;
  } catch (error) {
    console.error("Error creating communication", error);
    showMessage("error", "Ocurrió un error al crear la comunicación");
    throw error;
  }
};
