import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { ISelectFilterNotifications } from "@/components/atoms/Filters/FiltersNotifications/FiltersNotifications";

interface Notification {
  create_at: string;
  notification_type_name: string;
  client_name: string;
  incident_id: number | null;
  is_client_change: number;
  client_update_changes: Record<string, any>;
  days: string;
  id: number;
  is_read: number;
}

interface IUseNotificationOpen {
  projectId: number;
  filters: ISelectFilterNotifications;
}
export const useNotificationOpen = ({ projectId, filters }: IUseNotificationOpen) => {
  const queries = [];
  if (filters.lines.length > 0) queries.push(`line=${filters.lines.join(",")}`);
  if (filters.sublines.length > 0) queries.push(`subline=${filters.sublines.join(",")}`);
  if (filters.notificationTypes.length > 0)
    queries.push(`notification_type=${filters.notificationTypes.join(",")}`);

  const queryString = queries.length > 0 ? `?${queries.join("&")}` : "";

  const { data, error, isLoading, mutate } = useSWR<GenericResponse<Notification[]>>(
    `/notification/project/${projectId}/user${queryString}`,
    fetcher
  );

  return {
    data: data?.data,
    isLoading,
    isError: !!error,
    mutate
  };
};
