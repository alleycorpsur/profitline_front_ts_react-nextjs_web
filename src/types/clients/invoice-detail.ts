export interface InvoiceDetail {
  data: {
    results: IData[];
    totals: {
      total_general: number;
      total_discount: number;
      total_creditNotes: number;
      total_debitNotes: number;
      total_initial: number;
    };
  };
}

export interface IData {
  id: number;
  id_invoice: number;
  comments: string;
  files: string[];
  create_at: string;
  event_date: string;
  invoice_event_type_id: number;
  user_id: number | null;
  is_deleted: number;
  ammount: number | null;
  financial_discount_id: number | null;
  previous_status_id: number | null;
  email_id: number | null;
  radication_type_id: number | null;
  current_status_id: number | null;
  comments_conciliation: string | null;
  status_payment_agreement: number;
  single_payment_agreement_id: number;
  incident_id: number;
  user_name: string | null;
  event_type_name: string;
  status_name: string;
  previous_status: string | null;
  type_incident: string | null;
  sequence: number | null;
  is_rejected: number | null;
  status: number;
  description: string;
  project_id: number;
  client_id: number;
  id_erp: string;
  is_legalized: number;
  comments_incident: any[];
}
