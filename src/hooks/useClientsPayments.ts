import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { IClientPaymentStatus } from "@/types/clientPayments/IClientPayments";

interface Props {
  projectId: number;
  clientId: number;
}

export const useClientsPayments = ({ projectId, clientId }: Props) => {
  const pathKey = `/bank/get-payments/project/${projectId}/client/${clientId}`;

  const { data, error, isLoading, mutate } = useSWR<GenericResponse<IClientPaymentStatus[]>>(
    pathKey,
    fetcher
  );

  return {
    data: data?.data,
    isLoading,
    error,
    mutate
  };
};
