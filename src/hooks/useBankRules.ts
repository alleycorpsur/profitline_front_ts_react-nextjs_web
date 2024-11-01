import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { IAllRules } from "@/types/banks/IBanks";
import { useAppStore } from "@/lib/store/store";

type useBankRulesProps = {
  page: number;
  search: string;
  pageSize?: number;
};

export const useBankRules = ({ page, search, pageSize }: useBankRulesProps) => {
  const { ID } = useAppStore((state) => state.selectedProject);

  const pageQuery = `?page=${page}`;
  const searchQuery = `&search=${search}`;
  const pageSizeQuery = `&pageSize=${pageSize}`;

  const pathKey = `/bank-rule/project/${ID}${pageQuery}${pageSize ? pageSizeQuery : ""}${searchQuery}`;

  const { data, error, mutate } = useSWR<GenericResponse<IAllRules>>(pathKey, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate
  };
};
