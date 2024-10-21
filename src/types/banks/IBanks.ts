export interface IPaymentsByStatus {
  payments_status: string;
  payments_status_id: number;
  color: string;
  payments: ISingleBank[];
  total_account: number | null;
  payments_count: number;
}

export interface ISingleBank {
  id: number;
  description: string;
  id_account: number;
  project_id: number;
  id_client: number;
  payment_date: string | null;
  created_at: string;
  currency: string;
  initial_value: number;
  current_value: number | null;
  multiclient: number;
  id_status: number;
  is_delete: number;
  updated_at: string;
  updated_by: string | null;
  CLIENT_NAME: string;
  status_description: string;
  id_bank: number;
  account_description: string;
  bank_description: string;
}

export interface IClientsByProject {
  [key: string]: number;
}

export interface IAllRules {
  id: number;
  project_id: number;
  description: string;
  id_client: number;
  is_exactly: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  is_delete: any | null;
  client_name: string;
}

export interface IPostRule {
  project_id: number;
  description: string;
  id_client: number;
  is_exactly: boolean;
}
