import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { getIdToken } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";

interface MarkNotificationReadResponse {
  message: string;
  status: number;
}

export const markNotificationAsRead = async (
  notificationId: number
): Promise<AxiosResponse<MarkNotificationReadResponse>> => {
  const token = await getIdToken();
  try {
    const url = `${config.API_HOST}/notification/read/${notificationId}`;

    const response: AxiosResponse<MarkNotificationReadResponse> = await axios.post(
      url,
      {}, // Empty body as the curl command doesn't have a request body
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // If it's an Axios error with a response, return the response
      return error.response as AxiosResponse<MarkNotificationReadResponse>;
    }
    // For other types of errors, throw them
    throw error;
  }
};

export interface INotificationType {
  ID: number;
  NAME: string;
  IS_DELETED: number;
}

export const getNotificationTypes = async () => {
  const token = await getIdToken();
  try {
    const url = `${config.API_HOST}/notification/notification_type`;

    const response: AxiosResponse<GenericResponse<INotificationType[]>> = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data as INotificationType[];
  } catch (error) {
    console.error("Error fetching notification types", error);
    throw error;
  }
};
