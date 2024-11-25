import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { INotification } from "@/types/notifications/INotifications";

export const useRejectedNotifications = (projectId: number) => {
  const { data, error, mutate } = useSWR<GenericResponse<INotification[]>>(
    `/notification/rejecteds/project/${projectId}/user`,
    fetcher
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: !!error,
    mutate
  };
};
