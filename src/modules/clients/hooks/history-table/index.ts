import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { useDebounce } from "@/hooks/useDeabouce";
import { useMemo } from "react";

export interface IHistoryRecord {
  id: number;
  event: string;
  description: string;
  project_id: number;
  id_client: number;
  userId: number;
  created_at: string;
  is_deleted: number;
  payment_id: number;
  payment_amount: number;
  user: string;
}
interface Props {
  projectId: number;
  clientId?: string;
  search: string;
}

const useHistoryData = ({ projectId, clientId, search }: Props) => {
  const { data, error, isLoading } = useSWR<GenericResponse<IHistoryRecord[]>>(
    `/history/get-history?project_id=${projectId}&client_id=${clientId}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  const debouncedSearchValue = useDebounce(search, 300);
  console.log("data", data);
  const filteredData = useMemo(() => {
    return (
      data?.data?.data?.filter(
        (record) =>
          record.event.toLowerCase().includes(search.toLowerCase()) ||
          record.description.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [data?.data, debouncedSearchValue]);
  return {
    data: filteredData || [],
    isLoading,
    error
  };
};

export default useHistoryData;
