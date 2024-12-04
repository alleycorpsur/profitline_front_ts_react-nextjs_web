import config from "@/config";
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
import { API, getIdToken } from "@/utils/api/api";
import axios, { AxiosResponse } from "axios";

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

export const getForwardEvents = async (): Promise<string[]> => {
  const response: string[] = await API.get(`${config.API_HOST}/comunication/get_events`);
  return response;
};

export const getTemplateTags = async (): Promise<string[]> => {
  const response: string[] = await API.get(`${config.API_HOST}/comunication/get_tags`);
  return response;
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
  const now = new Date();
  const timeString = now.toLocaleString("es-CO");
  const eventTriggerDays = data?.trigger?.settings?.noticeDaysEvent;
  const modelData: ICreateCommunication = {
    // Where does invoice should come from?
    invoice_id: 1,
    project_id: projectId,
    data: {
      name: data.name,
      descripcion: data.description,
      trigger: {
        type: data.trigger.type,
        settings: {
          init_date: selectedPeriodicity?.init_date?.toISOString().split("T")[0],
          end_date: selectedPeriodicity?.end_date?.toISOString().split("T")[0],
          repeat: selectedPeriodicity?.frequency_number,
          frequency: selectedPeriodicity?.frequency?.value.toLowerCase(),
          days:
            data.trigger.type === "evento"
              ? eventTriggerDays
                ? parseInt(eventTriggerDays)
                : undefined
              : selectedPeriodicity?.days?.map((day) => day.value.toLowerCase()),
          values: data.trigger.settings.values?.map((value) => value.value),
          event_type: data.trigger.settings.event_type?.value
        }
      },
      rules: {
        channel: selectedBusinessRules.channels,
        line: selectedBusinessRules.lines,
        subline: selectedBusinessRules.sublines,
        zone: zones,
        groups_id: assignedGroups
      },
      template: {
        via: data.template.via.value,
        send_to: data.template.send_to.map((mail) => mail.value),
        copy_to: data.template.copy_to?.map((mail) => mail.value),
        tags: data.template.tags?.map((tag) => tag.value),
        time: timeString,
        message: data.template.message,
        // Where does title should come from?
        title: data.template?.title || "titulo quemado",
        subject: data.template.subject,
        files: data.template.files.map((file) => file.value)
      }
    }
  };

  try {
    const response: any = await axios.post(`${config.API_HOST}/comunication/create`, modelData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) showMessage("success", "Comunicación creada correctamente");
    return response;
  } catch (error) {
    console.error("Error creating communication", error);
    showMessage("error", "Ocurrió un error al crear la comunicación");
    return error;
  }
};
