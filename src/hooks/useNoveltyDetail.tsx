import useSWR from "swr";
import { fetcher } from "@/utils/api/api";

interface IEvent {
  approved_by: string | null;
  rejected_by: string | null;
  created_at: string;
  comments: string;
  files: any[]; // You might want to define a more specific type for files
}

export interface IIncidentDetail {
  incident_id: number;
  invoice_id: number;
  evidence_comments: string;
  evidence_files: any[]; // You might want to define a more specific type
  date: string;
  invoice_amount_difference: number | null;
  incident_name: string;
  is_open: boolean;
  client: string;
  responsible_user: string;
  invoice_cashport_value: number;
  invoice_client_value: number;
  approvers_users: string;
  events: IEvent[];
}

interface IIncidentDetailResponse {
  status: number;
  message: string;
  data: IIncidentDetail[];
}

interface UseIncidentDetailProps {
  incidentId: number;
}

export const useIncidentDetail = (props: UseIncidentDetailProps) => {
  const { data, isLoading } = useSWR<IIncidentDetailResponse>(
    `/invoice/incident-detail/${props.incidentId}`,
    fetcher,
    {}
  );

  return {
    data: data?.data,
    isLoading
  };
};
