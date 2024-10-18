import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { IAllRules } from "@/types/banks/IBanks";
import { useAppStore } from "@/lib/store/store";

export const useBankRules = () => {
  const { ID } = useAppStore((state) => state.selectedProject);

  const pathKey = `/bank-rule/project/${ID}`;

  const { data, error, mutate } = useSWR<GenericResponse<IAllRules[]>>(pathKey, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate
  };
};
