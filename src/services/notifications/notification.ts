import config from "@/config";
import { API } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";

interface MarkNotificationReadResponse {
  message: string;
  status: number;
}

export const markNotificationAsRead = async (
  notificationId: number
): Promise<MarkNotificationReadResponse> => {
  try {
    const url = `${config.API_HOST}/notification/read/${notificationId}`;

    const response: MarkNotificationReadResponse = await API.post(
      url,
      {} // Empty body as the curl command doesn't have a request body
    );
    return response;
  } catch (error) {
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
  try {
    const url = `${config.API_HOST}/notification/notification_type`;
    const response: GenericResponse<INotificationType[]> = await API.get(url, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching notification types", error);
    throw error;
  }
};
