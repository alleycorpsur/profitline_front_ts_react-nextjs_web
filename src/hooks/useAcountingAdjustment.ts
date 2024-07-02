import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { useAppStore } from "@/lib/store/store";

interface UserApproved {
  id: number;
  financial_discount_id: number;
  user_id: number;
  user_name: string;
}

interface ValidityRange {
  end: string;
  start: string;
}

interface FinancialDiscount {
  id: number;
  client_id: number;
  project_id: number;
  project_name: string;
  initial_value: number;
  current_value: number;
  comments: string | null;
  files: string | null;
  create_at: string;
  update_at: string;
  delete_at: string | null;
  status_id: number;
  status_name: string;
  document_type_id: number;
  document_type_name: string;
  percentage: number | null;
  date_of_issue: string;
  motive_id: number;
  motive_name: string;
  validity_range: ValidityRange;
  users_approved: UserApproved[];
}

interface GetFinancialDiscountsResponse {
  status: number;
  message: string;
  data: FinancialDiscount[];
}

export const useAcountingAdjustment = (clientId: number, type: number) => {
  const { ID } = useAppStore((state) => state.selectProject);
  const { data, error } = useSWR<GetFinancialDiscountsResponse>(
    `/financial-discount/project/${ID || 19}/client/${clientId}?type=${type}`,
    fetcher
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: !!error
  };
};
