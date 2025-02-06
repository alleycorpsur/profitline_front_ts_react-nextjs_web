import { useAppStore } from "@/lib/store/store";
import { GenericResponse } from "@/types/global/IGlobal";
import { fetcher } from "@/utils/api/api";
import useSWR from "swr";

export const useClientsGroupsSimplified = () => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);

  const path = `/group-client/project/${projectId}/lte`;

  const { data, error, isLoading, mutate } = useSWR<
    GenericResponse<
      {
        group_name: string;
        id: number;
      }[]
    >
  >(path, fetcher, {});

  return {
    data: data?.data,
    loading: isLoading,
    error,
    mutate
  };
};
