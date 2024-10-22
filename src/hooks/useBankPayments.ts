import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { IPaymentsByStatus } from "@/types/banks/IBanks";

interface Props {
  projectId: number;
}

export const useBankPayments = ({ projectId }: Props) => {
  const pathKey = `/bank/get-payments?project_id=${projectId}`;

  const { data, error, mutate } = useSWR<GenericResponse<IPaymentsByStatus[]>>(pathKey, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate
  };
};
