import useSWR from "swr";
import { fetcher } from "@/utils/api/api";

interface Motive {
  id: number;
  name: string;
}

interface GetMotivesResponse {
  status: number;
  message: string;
  data: Motive[];
}

export const useFinancialDiscountMotives = () => {
  const { data, error } = useSWR<GetMotivesResponse>("/financial-discount/motives", fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: !!error
  };
};
