export interface IClientPayment {
  id: number;
  description: string;
  id_account: number;
  project_id: number;
  id_client: number;
  payment_date: string; // ISO Date string
  created_at: string; // ISO Date string
  currency: string;
  initial_value: number;
  current_value: number;
  multiclient: number;
  id_status: number;
  is_delete: number;
  updated_at: string; // ISO Date string
  updated_by: string | null;
  evidence_url: string | null;
  id_payment: string | null;
  sequence: string | null;
  rule_id: number;
  CLIENT_NAME: string;
  sequence_payment: string | null;
  status_description: string;
  color: string; // Hex color code
  id_bank: number;
  account_description: string;
  bank_description: string;
  account_number: string;
  type_account: string;
}

export interface IClientPaymentStatus {
  payments_status: string;
  payments_status_id: number;
  color: string; // Hex color code
  payments: IClientPayment[];
}
