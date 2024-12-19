export interface IApplyTabRecord {
  id: number;
  id_erp: string;
  entity_type_id: number;
  project_id: number;
  client_id: number;
  financial_record_id: number | null;
  financial_discount_id: number | null;
  payment_id: number;
  amount: number;
  status: string;
  is_advance_payment: number;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  created_by: string;
  updated_by: string | null;
  entity_type_name: string;
  entity_description: string | null;
  initial_value: number;
  current_value: number;
  created_by_name: string | null;
  applied_amount: number;
}

export interface IApplyTabClients {
  payments: IApplyTabRecord[];
  invoices: IApplyTabRecord[];
  discounts: IApplyTabRecord[];
  summary: {
    total_invoices: number;
    total_payments: number;
    total_discounts: number;
    total_balance: number;
  };
}
