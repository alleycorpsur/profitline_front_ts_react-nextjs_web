import useSWR from "swr";
import { fetcher } from "@/utils/api/api";

import { ISelectFilterNotifications } from "@/components/atoms/Filters/FiltersNotifications/FiltersNotifications";

import { GenericResponse } from "@/types/global/IGlobal";
import { INotification } from "@/types/notifications/INotifications";

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

  const { data, error, isLoading, mutate } = useSWR<GenericResponse<INotification[]>>(
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
